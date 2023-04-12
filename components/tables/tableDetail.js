import { useMemo } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import { useRouter } from "next/router";

export default function TableDetail(props) {
  const router = useRouter()
  const data = useMemo(() => props.expenses, [props.expenses])
  const columns = useMemo(
    () => [
      {
        Header: 'Day',
        accessor: 'day', // accessor is the "key" in the data
      },
      {
        Header: 'Category',
        accessor: 'category.category',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        // Header: "Delete",
        Cell: ({ row }) => (
          <button onClick={() => {
            if (confirm("Are you sure to delete?")) {
              axios.delete('/api/deleteExpense/', {
                data: {
                  id: row.original.id,
                },
              })
              .then(res => {
                console.log(res);
                router.reload();
              })
              .catch(error => console.error(error));
            } else {
              console.log("No");
            }

          }}
          >Delete</button>
        ),
      },
    ])
  })

  return (
    <table {...getTableProps()} style={{ borderSpacing: '0px', margin: 'auto'}}  data-testid='expensesTableDetail'>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  border: 'solid 1px black',
                  background: '#D9D9D9',
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '10px 3px',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px black',
                      background: '#D9D9D9',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}