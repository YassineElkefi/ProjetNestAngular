export class Depense {
    constructor(
        public _id: string,
        public montant: number,
        public date: Date,
        public categorie: string,
        public description: string,
        public userId: string,
        public tags?: string[],

    ){}
}