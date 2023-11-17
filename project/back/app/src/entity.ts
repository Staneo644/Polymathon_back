export interface word {
  name: string;
  definition: string;
  etymology: string;
  example: string;
  gender: string;
  theme: string;
}

export interface word_id extends word {
  id: number;
  positive_note: number;
  negative_note: number;
}

export interface potential_word_id extends word {
  id: number;
  wiki_def: definition_wik[];
  user: string;
  true_word: number;
}

export interface user {
  email: string;
  password: string;
}

export interface user_id extends user {
  id: number;
  word_seeing: number[];
}

export interface theme {
  name: string;
  parent: string;
}

export interface theme_id extends theme {
  words_number: number;
}

export interface definition_wik {
  definition: string[];
  nature: string;
}
