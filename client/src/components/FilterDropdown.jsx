import styles from "./FilterDropdown.module.css";

export default function FilterDropdown({ selectedFilter, onFilterChange }) {
  return (
    <div className={styles.filter_dropdown}>
      <h3 htmlFor="filter">Filter by:</h3>
      <select
        className={styles.select}
        id="filter"
        value={selectedFilter}
        onChange={onFilterChange}
      >
        <option value="position">Position</option>
        <option value="hand">Hand</option>
      </select>
    </div>
  );
}
