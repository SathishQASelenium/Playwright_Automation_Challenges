/**
 * appConfig - environment-driven settings for the DemoQA modal dialogs
 * challenge.
 */

export const appConfig = {
    baseURL: process.env.BASE_URL ?? 'https://demoqa.com',
    modalDialogsPath: '/modal-dialogs',
} as const;
