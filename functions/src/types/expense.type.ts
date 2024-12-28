import { CreatedBy } from "../utils/comman";

interface ExpenseInterface {
    id: string;
    name: string;
    amount: number;
    currencyCode: string;
    description: string;
    categoryId: string;
    expenseDate: number;
    spaceId: string;
    createdBy: CreatedBy;
}

export {ExpenseInterface};
