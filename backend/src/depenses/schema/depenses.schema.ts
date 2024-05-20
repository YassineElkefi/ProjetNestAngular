import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DepenseDocument = Depense & Document;

@Schema()
export class Depense{
    
    @Prop({ required: true })
    montant: number;

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ required: true })
    categorie: string;

    @Prop()
    description: string;

    @Prop({ type: [String] , required: false})
    tags: string[];
}

export const DepenseSchema = SchemaFactory.createForClass(Depense);