import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "src/category/schema/category.schema";

export type DepenseDocument = Depense & Document;

@Schema()
export class Depense{
    
    @Prop({ required: true })
    montant: number;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ type: String, required: true })
    category: string;
       

    @Prop()
    description: string;

    @Prop({ type: [String] , required: false})
    tags: string[];
}

export const DepenseSchema = SchemaFactory.createForClass(Depense);