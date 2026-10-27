/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const name = 'Jade';
export const email = 'jdpolo.1218@gmail.com';
export const mailSubject = 'A storytelling landing page of my own';
export const mailBody =
  'Hi Jade,\n\nI visited He’s Not Heavy, He’s My Brother and it touched me. I’d love to talk about creating a storytelling landing page of my own.\n\n';
export const title = 'About this story';

export const paragraphs: readonly string[] = [
  'Hi, I’m Jade, a frontend developer who loves building pages like this one. Thank you for taking the time to read this.',
  'This story isn’t mine. It’s a real experience I heard in a talk, and it has stayed with me ever since. It’s one of my favorite reminders that a little love can make any load feel lighter. I hope it reaches your heart the way it reached mine.',
  'If you’d like to share a story of your own through a page like this, I would love to help you bring it to life. Send me an email and let’s talk.',
] as const;

export const buttonLabel = 'Email me';

export const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
