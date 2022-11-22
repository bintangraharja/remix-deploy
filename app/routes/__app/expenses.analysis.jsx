import ExpenseStatistics from "~/components/expenses/ExpenseStatistics"
import Chart from "~/components/expenses/Chart"
import { getExpenses } from "~/data/expenses.server"
import { json } from "@remix-run/node";
import Error from "~/components/util/Error";
import { useCatch, useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/data/auth.server";



export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData();

  // const hasExpenses = expenses && expenses.length > 0;

    return (
      <main>
        <Chart expenses={expenses}/>
        <ExpenseStatistics expenses={expenses}/>
      </main>
    );
  }
  
export async function loader({request}){
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);

  if(!expenses || expenses.length === 0){
    throw json({message: 'Could not load expenses for the requested analysis.'},
    {status: 404, statusText: 'Expenses not found.'});
  }
  return expenses;
}

export function CatchBoundary(){
  const caughtResponse = useCatch();

  return(
    <main>
      <Error title={caughtResponse.statusText}>
        <p>
          {caughtResponse.data?.message || 
          'Something went wrong, could not load expenses.'}
        </p>
      </Error>
    </main>
  )
}