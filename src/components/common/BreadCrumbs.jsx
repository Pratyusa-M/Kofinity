/* eslint-disable react/prop-types */

const Breadcrumbs = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[#ffffff] text-[15px] font-[400] text-roboto flex items-center "
    >
      <ol role="list" className="flex  flex-wrap">
        {items?.map((item, index) => (
          <li key={index} className="flex items-center">
            {item?.current || index === items?.length - 1 ? (
              <span className="text-white">{item?.label}</span>
            ) : (
              <a href={item.link} className="text-white  ">
                {item?.label}
              </a>
            )}
            {index < items?.length - 1 && (
              <div className="text-gray-400 mx-4">{">"}</div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
