const moment = require('moment')
const { Util } = require('discord.js')
const { createCanvas, Image } = require('canvas')

const CanvasUtils = require('./CanvasUtils.js')
const Constants = require('../Constants.js')
const Color = require('../Color.js')

const maxLength = (text, length) => {
  if (text.length > length) return text.toString().substring(0, length) + '...'
  return text
}

module.exports = class CanvasTemplates {
  static async levelUpdated (user, t, { level, background, favColor }) {
    const WIDTH = 150
    const HEIGHT = 150

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const IMAGE_ASSETS = Promise.all([
      Image.from(user.displayAvatarURL),
      Image.from(background)
    ])

    const [avatarImage, backgroundImage] = await IMAGE_ASSETS

    // Layout

    ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = 'rgba(250, 250, 250, .5)'
    ctx.fillRect(0, HEIGHT - 60, WIDTH, 60)

    ctx.fillStyle = favColor
    ctx.fillRect(0, HEIGHT - 60 - 2, WIDTH, 4)

    // Logo

    const LOGO_SIZE = 60

    ctx.fillStyle = '#FFF'
    ctx.fillRect((WIDTH - LOGO_SIZE) / 2 - 2, 8, LOGO_SIZE + 4, LOGO_SIZE + 4)

    ctx.drawImage(
      avatarImage,
      (WIDTH - LOGO_SIZE) / 2,
      10,
      LOGO_SIZE,
      LOGO_SIZE
    )

    // Level Texts

    const blockSizeInsert = 5

    const textLevelUpedMeasure = CanvasUtils.measureText(
      ctx,
      '22px Bebas Neue',
      t('economy:leveluped')
    )
    const blockAlign = CanvasUtils.resolveAlign(
      WIDTH / 2,
      100,
      textLevelUpedMeasure.width + blockSizeInsert * 3,
      textLevelUpedMeasure.height + blockSizeInsert,
      2
    )

    ctx.fillStyle = 'rgba(0, 0, 0, .3)'
    ctx.fillRect(
      blockAlign.x,
      blockAlign.y - textLevelUpedMeasure.height - blockSizeInsert * 1.5,
      textLevelUpedMeasure.width + blockSizeInsert * 3,
      textLevelUpedMeasure.height + blockSizeInsert
    )

    ctx.fillStyle = '#FFF'
    ctx.write(t('economy:leveluped'), WIDTH / 2, 100, '22px Bebas Neue', 2)

    //

    const font = 'italic 22px Lemon Milk Bold'

    const space = CanvasUtils.measureText(ctx, font, ' ')
    const textLevelBrandMeasure = CanvasUtils.measureText(
      ctx,
      font,
      t('economy:lvl')
    )
    const textLevelNumberMeasure = CanvasUtils.measureText(ctx, font, level)

    ctx.fillStyle = '#000'
    const levelBrand = ctx.write(
      t('economy:lvl'),
      (WIDTH - textLevelNumberMeasure.width - space.width) / 2,
      125,
      font,
      2
    )

    ctx.fillStyle = favColor
    ctx.fillText(
      level,
      levelBrand.leftX + textLevelBrandMeasure.width + space.width,
      levelBrand.bottomY
    )

    return canvas.toBuffer()
  }

  static async profile (
    user,
    t,
    {
      profile: { background, pocket, level, rep, xp, favColor, personalText },
      currentXp: { current, next },
      rank
    }
  ) {
    const WIDTH = 800
    const HEIGHT = 700

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.PROFILE_IMAGE),
      Image.from(background),
      Image.from(user.displayAvatarURL)
    ])

    const FAV_COLOR = new Color(favColor).rgb()
    const FAV_COLOR_RGBA = new Color(favColor).setAlpha(0.5).rgba(false)

    // Draw

    const [Source, backgroundImage, avatarImage] = await IMAGE_ASSETS

    const LOGO_SIZE = 200
    const LOGO_BORDER = 10
    const LOGO_X = 50
    const LOGO_Y = 100

    const bgWidth =
      backgroundImage.width >= WIDTH
        ? backgroundImage.width
        : backgroundImage.width + WIDTH
    const bgHeight =
      backgroundImage.height >= HEIGHT
        ? backgroundImage.height
        : backgroundImage.height + HEIGHT
    const bgY = bgHeight > HEIGHT ? -((bgHeight - HEIGHT) / 2) : 0
    const bgX = bgWidth > WIDTH ? (WIDTH - bgWidth) / 2 : 0
    ctx.drawBlurredImage(backgroundImage, 5, bgX, bgY, bgWidth, bgHeight)
    ctx.drawImage(Source, 0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = FAV_COLOR
    ctx.roundFill(
      LOGO_X,
      LOGO_Y,
      LOGO_SIZE + LOGO_BORDER,
      LOGO_SIZE + LOGO_BORDER
    )
    ctx.roundImage(
      avatarImage,
      LOGO_X + LOGO_BORDER / 2,
      LOGO_Y + LOGO_BORDER / 2,
      LOGO_SIZE,
      LOGO_SIZE
    )

    const REP_WIDTH = 284.5
    const REP_HEIGHT = 80
    const REP_X = 18.5
    const REP_Y = 335

    ctx.fillStyle = FAV_COLOR_RGBA.replace('0.5', '0.3')
    ctx.fillRect(REP_X, REP_Y, REP_WIDTH, REP_HEIGHT)

    const BAR_WIDTH = 390
    const BAR_X = 340
    const BAR_Y = 334

    const BAR = BAR_WIDTH / (next / current)

    ctx.fillStyle = FAV_COLOR_RGBA // 'rgba(255, 255, 255, .8)';
    ctx.fillRect(BAR_X + 10, BAR_Y + 10, BAR > 10 ? BAR : 10, 40)

    // Texts

    const normalFont = (size = '36px') => `${size} Montserrat`
    const bolderFont = (size = '36px') => `${size} Montserrat ExtraBold`
    const bolderItalicFont = (size = '36px') =>
      `italic ${size} Montserrat ExtraBold`

    const USERNAME_X = 430
    const USERNAME_Y = 278
    const TAG_X = 660
    const TAG_Y = 206

    ctx.fillStyle = '#FFF'
    ctx.write(
      maxLength(user.username, 14),
      WIDTH - USERNAME_X,
      USERNAME_Y,
      bolderItalicFont(),
      8
    )
    ctx.write(user.discriminator, TAG_X, TAG_Y, bolderItalicFont(), 8)

    const XP_TEXT = `XP: ${current} / ${next}`
    const XPTextMeasure = CanvasUtils.measureText(
      ctx,
      normalFont('22px'),
      XP_TEXT
    )

    ctx.write(
      XP_TEXT,
      (416 + BAR_X * 2 + XPTextMeasure.width) / 2,
      BAR_Y + XPTextMeasure.height * 1.5,
      normalFont('22px'),
      4
    )

    const REP_TEXT = `+${rep}`
    const REPTextMeasure = CanvasUtils.measureText(ctx, bolderFont(), REP_TEXT)

    ctx.write(
      REP_TEXT,
      (REP_WIDTH + REP_X * 2 + REPTextMeasure.width) / 2,
      REP_Y + REP_HEIGHT / 2,
      bolderFont(),
      4
    )

    const PROFILE_INFO_TITLE_X = 480
    const PROFILE_INFO_X = 630

    ctx.write(
      t('economy:totalXp'),
      PROFILE_INFO_TITLE_X,
      440,
      bolderFont('24px')
    )
    ctx.write(
      t('economy:pockets'),
      PROFILE_INFO_TITLE_X,
      485,
      bolderFont('24px')
    )
    ctx.write(t('economy:rank'), PROFILE_INFO_TITLE_X, 530, bolderFont('24px'))

    ctx.fillStyle = FAV_COLOR
    ctx.write(xp, PROFILE_INFO_X, 440, bolderItalicFont('32px'))
    ctx.write(pocket, PROFILE_INFO_X, 485, bolderItalicFont('32px'))
    ctx.write(rank, PROFILE_INFO_X, 530, bolderItalicFont('32px'))

    ctx.fillStyle = '#FFF'

    const LINE_MAX_X = 748
    const LINE_X = 340
    const LINE_Y = 545

    const PersonalTextMeasure = CanvasUtils.measureText(
      ctx,
      bolderItalicFont('22px'),
      t('economy:personalText')
    )
    const PERSONAL_LABEL = ctx.write(
      t('economy:personalText'),
      LINE_MAX_X - PersonalTextMeasure.width / 2,
      LINE_Y + 10,
      bolderItalicFont('22px'),
      2
    )

    const LEVEL_X = 310
    const LEVEL_Y = 450

    const LEVEL_LABEL = ctx.write(
      t('economy:level'),
      LEVEL_X,
      LEVEL_Y,
      bolderFont('40px')
    )

    const LEVEL_TEXT = level
    const LevelNumberTextMeasure = CanvasUtils.measureText(
      ctx,
      bolderFont(),
      LEVEL_TEXT
    )

    ctx.fillStyle = FAV_COLOR
    ctx.write(
      LEVEL_TEXT,
      (LEVEL_LABEL.width + LEVEL_X * 2 + LevelNumberTextMeasure.width) / 2,
      LEVEL_LABEL.bottomY + 40,
      bolderFont('60px'),
      4
    )
    ctx.printAt(
      Util.escapeMarkdown(personalText),
      LINE_X,
      PERSONAL_LABEL.bottomY + 25,
      25,
      520,
      bolderFont('22px')
    )

    return canvas.toBuffer()
  }

  static async nowPlaying (
    t,
    { state: { position } },
    { color, artwork, isStream, title, source, author, ms: length }
  ) {
    const WIDTH = 800
    const HEIGHT = 300

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const IMAGE_ASSETS = Promise.all([
      Image.from(artwork || Constants.PLAYER_SOURCES_BACKGROUND[source])
    ])

    const FAV_COLOR = new Color(color).rgb()
    const FAV_COLOR_RGBA = new Color(color).setAlpha(0.4).rgba(false)

    // Draw

    const [backgroundImage] = await IMAGE_ASSETS

    const THUMBNAIL_WIDTH = Math.trunc(WIDTH / 3)
    const FULL_WIDTH = WIDTH - THUMBNAIL_WIDTH

    // Bar

    const BAR_WIDTH = 320
    const BAR_HEIGHT = 10
    const BAR_X = THUMBNAIL_WIDTH + (FULL_WIDTH - BAR_WIDTH) / 2
    const BAR_Y = 270

    const BAR = isStream ? BAR_WIDTH : BAR_WIDTH / (length / position)

    ctx.fillStyle = FAV_COLOR_RGBA
    ctx.roundRect(BAR_X, BAR_Y, BAR_WIDTH, BAR_HEIGHT, 5, true)
    ctx.fillStyle = FAV_COLOR
    ctx.roundRect(BAR_X, BAR_Y, BAR > 10 ? BAR : 10, BAR_HEIGHT, 5, true)

    // Bar Text

    const formatTime = t =>
      moment.duration(t).format('hh:mm:ss', { stopTrim: 'm' })
    const TIME_FONT = '16px "Montserrat ExtraBold"'

    const LEFT_X = BAR_X - 10
    const RIGHT_X = BAR_X + (FULL_WIDTH - BAR_WIDTH / 2) + 10
    const TIME_Y = BAR_Y + BAR_HEIGHT / 2

    ctx.fillStyle = '#FFF'
    ctx.write(formatTime(position), LEFT_X, TIME_Y, TIME_FONT, 4)

    if (!isStream) {
      ctx.write(formatTime(length), RIGHT_X, TIME_Y, TIME_FONT, 4)
    } else {
      const LIVE_CIRCLE_RADIUS = 5
      const LIVE_TEXT = t('music:live').toUpperCase()
      const live = ctx.write(LIVE_TEXT, RIGHT_X, TIME_Y, TIME_FONT, 4)
      ctx.fillStyle = '#FF0000'
      ctx.circle(
        live.leftX - LIVE_CIRCLE_RADIUS * 2,
        live.centerY,
        LIVE_CIRCLE_RADIUS,
        0,
        Math.PI * 2,
        true
      )
      ctx.fillStyle = '#FFF'
    }

    const LEFT_TEXT_MARGIN = THUMBNAIL_WIDTH + 20

    // Title

    const titleLength = title.length
    title =
      titleLength > 50
        ? `${title
            .split(' ')
            .slice(0, 8)
            .join(' ')}...`
        : title
    const TITLE_FONT = 'italic 34px "Montserrat Black"'
    const titleY = ctx.printAt(
      Util.escapeMarkdown(title),
      LEFT_TEXT_MARGIN,
      40,
      35,
      WIDTH - THUMBNAIL_WIDTH - 20,
      TITLE_FONT
    )

    // Author

    ctx.fillStyle = FAV_COLOR_RGBA.replace('.4', '.6')
    const AUTHOR_FONT = 'italic 22px Montserrat ExtraBold'
    ctx.printAt(
      author,
      LEFT_TEXT_MARGIN,
      Number(titleY) + 10,
      30,
      WIDTH - THUMBNAIL_WIDTH - 20,
      AUTHOR_FONT
    )

    // Thumbnail

    ctx.drawBlurredImage(backgroundImage, 20, 0, 0, THUMBNAIL_WIDTH, HEIGHT)
    const THUMBNAIL_HEIGHT =
      backgroundImage.height * (THUMBNAIL_WIDTH / backgroundImage.width)
    ctx.drawImage(
      backgroundImage,
      0,
      HEIGHT * 0.5 - THUMBNAIL_HEIGHT * 0.5,
      THUMBNAIL_WIDTH,
      THUMBNAIL_HEIGHT
    )

    // Background

    ctx.globalCompositeOperation = 'destination-over'

    const realColor = new Color('#000')
    const gradientColor = a => realColor.setAlpha(a).rgba(true)

    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, gradientColor(0.5))
    grd.addColorStop(1, gradientColor(1))
    ctx.fillStyle = grd
    ctx.fillRect(THUMBNAIL_WIDTH, 0, WIDTH - THUMBNAIL_WIDTH, HEIGHT)

    const bgWidth = WIDTH - THUMBNAIL_WIDTH
    let bgHeight = (bgWidth / backgroundImage.width) * backgroundImage.height
    bgHeight = bgHeight >= HEIGHT ? bgHeight : HEIGHT
    const bgY = bgHeight > HEIGHT ? -((bgHeight - HEIGHT) / 2) : 0
    ctx.drawBlurredImage(
      backgroundImage,
      2,
      THUMBNAIL_WIDTH,
      bgY,
      bgWidth,
      bgHeight
    )

    // Texts

    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(0, 0, WIDTH, HEIGHT, 10, true)

    return canvas.toBuffer()
  }
}
