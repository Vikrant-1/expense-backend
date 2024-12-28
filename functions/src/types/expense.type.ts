import { CreatedBy } from "../utils/comman";

interface ExpenseInterface {
    id: string;
    name: string;
    amount: number;
    currencyCode: string;
    description: string;
    categoryId: string;
    expenseDate: number;
    splitId?: string;
    groupId?: string;
    createdBy: CreatedBy;
}

export {ExpenseInterface};
