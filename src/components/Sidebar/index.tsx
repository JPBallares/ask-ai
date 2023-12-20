export default function Sidebar() {
  return (
    <div className="sidebar-wrapper w-1/4 p-4">
      <nav>
        <ul>
          <li className="dark:text-white p-3">Item 1</li>
          <li className="dark:text-white p-3">Item 2</li>
          <li className="dark:text-white p-3">Item 3</li>
          {/* Add new items here */}
          <li className="dark:text-white p-3">New Item 1</li>
          <li className="dark:text-white p-3">New Item 2</li>
        </ul>
      </nav>
    </div>
  );
}
