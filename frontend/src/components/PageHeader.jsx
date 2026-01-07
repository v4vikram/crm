import { Button } from "./Button";

const PageHeader = ({
    title,
    icon: Icon,
    buttonText,
    buttonIcon: ButtonIcon,
    onButtonClick,

    /** permissions */
    showButton = true,
    allowedRoles = [],   // ['admin']
    currentUser = null, // user object
}) => {
    const canShowButton = showButton && (!allowedRoles.length || (currentUser && allowedRoles.includes(currentUser.role)));

    return (
        <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {Icon && <Icon className="h-6 w-6 text-primary-600" />}
                    {title}
                </h1>
            </div>

            {/* Right */}
            {canShowButton && (
                <Button onClick={onButtonClick}>
                    {ButtonIcon && (
                        <ButtonIcon className="mr-2 h-4 w-4" />
                    )}
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default PageHeader;
