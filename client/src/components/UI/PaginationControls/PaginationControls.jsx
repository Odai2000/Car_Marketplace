const PaginationControls = ({ pageCount, pageIndex,onChange }) => {
  return (
    <div
      className="PaginationControls"
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        // marginTop: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: ".25rem", alignItems: "center" }}>
        {[...Array(pageCount)].map((_, pg) => {
          let distance = Math.abs(pageIndex - pg);
          if (distance < 3 || pg == 0 || pg == pageCount - 1)
            return (
              <button
                key={pg}
                onClick={() => onChange(pg)}
                disabled={pg === pageIndex}
                style={{
                  fontWeight: pg === pageIndex ? "bold" : "normal",
                  background: pg === pageIndex ? "var(--primary)" : "#fff",
                  color: pg === pageIndex ? "#fff" : "var(--primary)",
                  padding: "1em 1.25em",
                  border: "1px solid var(--primary)",
                  borderRadius: "4px",
                  cursor: pg === pageIndex ? "default" : "pointer",
                }}
              >
                {pg + 1}
              </button>
            );
          else if (distance == 3)
            return (
              <span
                key={`dot-${pg}`}
                style={{ minWidth: "2em", textAlign: "center" }}
              >
                …
              </span>
            );
        })}
      </div>
    </div>
  );
};

export default PaginationControls;
