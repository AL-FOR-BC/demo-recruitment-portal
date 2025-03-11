interface LoadingProps {
    loading?: boolean;
    cover?: boolean;
    align?: 'center' | 'top';
    customLoader?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    text?: string;
}

const Loading = ({ 
    loading = true, 
    cover = false, 
    align = 'center',
    customLoader,
    size = 'md',
    color = 'purple',
    text = 'Loading...'
}: LoadingProps) => {
    if (!loading) return null;

    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }

    const spinnerSize = sizeMap[size]
    const spinnerColor = `border-${color}-600 dark:border-${color}-500`
    const bgColor = `border-${color}-200 dark:border-${color}-900`

    const loadingClass = `flex flex-col gap-4 ${
        align === 'center' ? 'items-center justify-center' : 'items-center pt-8'
    }`

    const containerClass = cover
        ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50'
        : 'w-full h-full'

    return (
        <div className={containerClass}>
            <div className={loadingClass}>
                {customLoader || (
                    <>
                        <div className="relative">
                            <div className={`${spinnerSize} rounded-full border-4 ${bgColor} animate-spin`}>
                            </div>
                            <div className={`${spinnerSize} rounded-full border-4 border-t-${spinnerColor} animate-spin absolute inset-0`}>
                            </div>
                        </div>
                        {text && (
                            <div className={`text-${color}-600 dark:text-${color}-400 text-sm font-medium`}>
                                {text}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Loading
