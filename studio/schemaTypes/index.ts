import {homePageType} from './homePageType'
import {aboutPageType} from './aboutPageType'
import {givePageType} from './givePageType'
import {contactPageType} from './contactPageType'
import {announcementType} from './announcementType'
import {faqItemType} from './faqItemType'
import {givingMethodType} from './givingMethodType'
import {valueItemType} from './valueItemType'
import {ministryItemType} from './ministryItemType'
import {richTextType} from './richTextType'
import {withChineseReminders} from './chineseReminder'

export const schemaTypes = [
  homePageType,
  aboutPageType,
  givePageType,
  contactPageType,
  announcementType,
  givingMethodType,
  faqItemType,
  valueItemType,
  ministryItemType,
  richTextType,
].map(withChineseReminders)
