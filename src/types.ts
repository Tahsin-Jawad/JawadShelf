export type MaterialType = 'HTML' | 'PDF' | 'DOCX' | 'PPTX' | 'IMAGE' | 'OTHER';

export interface MaterialItem {
  id: string;
  title: string;
  filename: string;
  type: MaterialType;
  extension: string;
  url: string;
  sizeInBytes: number;
}

export interface CourseData {
  id: string;
  code: string;
  title: string;
  chapters: MaterialItem[];
  others: MaterialItem[];
}

export type ThemeMode = 'light' | 'dark';