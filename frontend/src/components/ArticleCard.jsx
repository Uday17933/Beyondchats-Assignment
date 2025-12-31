const ArticleCard = ({ article }) => {
  return (
    <div style={styles.card}>
      <h3>
        {article.title}{" "}
        {article.isUpdated && <span style={styles.badge}>Updated</span>}
      </h3>

      <p>{article.content.slice(0, 200)}...</p>

      {article.isUpdated && article.references?.length > 0 && (
        <div>
          <strong>References:</strong>
          <ul>
            {article.references.map((ref, i) => (
              <li key={i}>
                <a
                  href={ref}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                  }}
                >
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    maxWidth: "800px", // 👈 limit card width
    margin: "0 auto 24px auto", // 👈 FORCE CENTER
    boxSizing: "border-box",
    border: "1px solid #ddd",
    padding: "16px",
    borderRadius: "8px",
  },
  badge: {
    background: "#4CAF50",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "4px",
  },
};

export default ArticleCard;
