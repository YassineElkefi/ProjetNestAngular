export class CreateDepenseDto {
   readonly montant: number;
   readonly categorie: string;
   readonly description: string;
   readonly date: Date;
   readonly tags?: string[];
}
