export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/logo-removebg-preview.png"
            alt="NITDA Logo"
            className={`object-contain ${props.className || ''}`}
        />
    );
}
