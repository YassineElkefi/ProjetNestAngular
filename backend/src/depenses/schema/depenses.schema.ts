import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
<<<<<<< HEAD
import { Category } from "src/category/schema/category.schema";
=======
import { Types } from "mongoose";
>>>>>>> d26290f5308fdbe643f3b7c1751fcd3eb874d03d

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

    @Prop({required: true })
    userId: string;
}

export const DepenseSchema = SchemaFactory.createForClass(Depense);