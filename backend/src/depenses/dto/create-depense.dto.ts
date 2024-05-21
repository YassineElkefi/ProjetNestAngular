import { Category } from "src/category/schema/category.schema";

export class CreateDepenseDto {
   readonly montant: number;
   readonly category: string;
   readonly description: string;
   readonly date: Date;
   readonly tags?: string[];
}
