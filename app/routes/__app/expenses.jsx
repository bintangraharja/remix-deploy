import { Link, Outlet, useLoaderData } from "@remix-run/react";

// import expensesStyles from '~/styles/expenses.css';
import ExpensesList from "~/components/expenses/ExpensesList";
import { FaDownload, FaPlus } from "react-icons/fa";
import { getExpenses } from "~/data/expenses.server";
import { requireUserSession } from "~/data/auth.server";
import { json } from "@remix-run/node";



export default function ExpensesLayout(){
  const expenses = useLoaderData();

  const hasExpenses = expenses && expenses.length > 0;
  
  return(
    <>
      <Outlet/>
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus/>
            <span>Add Expense</span>
          </Link>
          <a href="/expenses/raw">
            <FaDownload/>
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses}/>}
        {!hasExpenses && <section id="no-expenses">
          <h1>No Expenses Found</h1>
          <p>Start <Link to="add">adding some</Link> today.</p>
        </section>}
      </main>
    </>
    )
}

export async function loader({ request }){
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);
  // return expenses;
  return json(expenses, {
    headers: {
      'Cache-Control': 'max-age=3',
    }
  })

  // if(!expenses || expenses.length === 0){
  //   throw json(
  //     {message: 'Could not find any expenses.'}, 
  //     {status: 404, statusText: 'No expenses found.'}
  //   );
  // }
}

// export function CatchBoundary(){
//   return <p>Error</p>
// }

// export function links(){
//     return[{rel: 'stylesheet', href: expensesStyles}];
// }