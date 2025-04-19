export type Product = {
    product_id: number;
    product_type: string;
    company_name: string;
    incoming_mass: number;
    incoming_date: Date;
    outgoing_mass: number;
    outgoing_date: Date | null;
}

export type InnerProducts = {
    product_type: string;
    company_name: string;
    remaining_mass: number;
    outgoing_date: Date | null;
}

export type ProductMovements = {
    company_id: number
    company_name: string,
    product_id: number
    product_name: string
    total_incoming: number
    total_outgoing: number
    remaining_mass: number
    last_movement_date: Date
}