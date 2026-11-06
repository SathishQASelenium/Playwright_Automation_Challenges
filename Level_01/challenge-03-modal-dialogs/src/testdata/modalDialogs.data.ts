/**
 * Expected content for the DemoQA modal dialogs.
 * Captured from https://demoqa.com/modal-dialogs.
 */

export interface ModalContent {
    title: string;
    body: string;
}

export const smallModalContent: ModalContent = {
    title: 'Small Modal',
    body: 'This is a small modal. It has very less content',
};

export const largeModalContent: ModalContent = {
    title: 'Large Modal',
    body:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
        'when an unknown printer took a galley of type and scrambled it to make a type specimen book. ' +
        'It has survived not only five centuries, but also the leap into electronic typesetting, ' +
        'remaining essentially unchanged. It was popularised in the 1960s with the release of ' +
        'Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
        'software like Aldus PageMaker including versions of Lorem Ipsum.',
};
