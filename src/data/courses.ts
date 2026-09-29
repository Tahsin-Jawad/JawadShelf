export interface Chapter {
  id: string;
  title: string;
  path: string;
}

export interface OtherMaterial {
  id: string;
  title: string;
  path: string;
  type: 'pdf' | 'docx' | 'ppt' | 'other';
}

export interface Course {
  code: string;
  title: string;
  chapters: Chapter[];
  otherMaterials: OtherMaterial[];
}

export const coursesData: Course[] = [
  {
    code: "CSE302",
    title: "Course Title Placeholder",
    chapters: [
      {
        id: "ch01",
        title: "Chapter 01",
        path: "/materials/CSE302/chapters/ch01.html",
      },
    ],
    otherMaterials: [
      {
        id: "mat01",
        title: "Lecture Slide / Sample PDF",
        path: "/materials/CSE302/other/sample.pdf",
        type: "pdf",
      },
    ],
  },
  {
    code: "CSE345",
    title: "Digital Logic Design",
    chapters: [
      {
        id: "ch01",
        title: "Chapter 1 & 2 Master Study Guide",
        path: "/materials/CSE345/Chapters/chapter_1_2_complete_guide.html",
      },
    ],
    otherMaterials: [],
  },
  {
    code: "GEN7209",
    title: "Course Title Placeholder",
    chapters: [],
    otherMaterials: [],
  },
  {
    code: "GEN703",
    title: "Course Title Placeholder",
    chapters: [],
    otherMaterials: [],
  },
];