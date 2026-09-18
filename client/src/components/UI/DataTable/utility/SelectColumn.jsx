const SelectionColumn = {
  id: "select",

  header: ({table}) => (
    <div className="select-col" style={{display:"flex",justifyContent:"center"}} >
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="select-col" style={{display:"flex",justifyContent:"center"}}>
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  ),
};

export default SelectionColumn;