export interface MarkDownModel {
  markDown: string;
  html: string;
}

export enum EditorControlTypes {
  BOLD = 'Bold Button',
  ITALICS = 'Italics button',
  LINK = 'Link Button',
  UNDERLINE = 'Underline button'
}

export type EditorControls = EditorControlTypes.BOLD | EditorControlTypes.ITALICS | EditorControlTypes.LINK | EditorControlTypes.UNDERLINE;
