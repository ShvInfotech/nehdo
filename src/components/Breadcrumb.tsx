import React from "react";
import { Link } from "react-router-dom";
import { IoChevronForward, IoHomeOutline } from "react-icons/io5";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
    <nav className="flex items-center gap-2 text-sm text-muted flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand transition-colors flex items-center gap-1">
            <IoHomeOutline size={14} />
            <span>Home</span>
        </Link>
        {items.map((item, i) => (
            <React.Fragment key={i}>
                <IoChevronForward size={12} className="text-gray-300" />
                {item.href ? (
                    <Link to={item.href} className="hover:text-brand transition-colors">{item.label}</Link>
                ) : (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                )}
            </React.Fragment>
        ))}
    </nav>
);

export default Breadcrumb;
