export type Company = {
    id: number
    name: string
}

export type Product = {
    id: number;
    name: string;
    project_code: string | null
}

export type InnerProducts = {
    product_id: number;
    company_id: number;
    product_name: string;
    company_name: string;
    remaining_mass: number;
    last_movement: Date | null;
    last_movement_type: "incoming" | "outgoing"
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