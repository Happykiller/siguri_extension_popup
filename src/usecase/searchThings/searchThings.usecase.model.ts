// src\usecase\searchThings\searchThings.usecase.model.ts
export default interface SearchThingsUsecaseModel {
  message: string;
  data?: {
    id: string,
    chest_id: string,
    chest_label: string,
    type: string,
    snippet: string
  }[],
  error?: string;
}