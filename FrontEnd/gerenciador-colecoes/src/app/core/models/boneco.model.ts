export type Marca = 'funko' | 'hot-toys' | 'threezero';

export interface Boneco {
  id: number;
  nome: string;
  marca: Marca;
  franquia: string; //? Ex: Marvel, Star Wars, DC
  imagem: string;
  lancamento: boolean;
  galeria?: string[];
}

export const MARCAS: { id: Marca; nome: string; descricao: string }[] = [
  { id: 'funko', nome: 'Funko Pop', descricao: 'Vinil colecionável' },
  { id: 'hot-toys', nome: 'Hot Toys', descricao: 'Escala 1:6' },
  { id: 'threezero', nome: 'Threezero', descricao: 'Escala 1:6' },
];
