import { FunctionComponent, useCallback, useState } from "react";

interface CopyButtonProps {
    textToCopy: string
}

const CopyButton: FunctionComponent<CopyButtonProps> = ({ textToCopy }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Unabled to copy", error);
        }
    };

    return (
        <button onClick={copyToClipboard}>
            {copied ? "Copied ✓" : "Copy"}
        </button>
    );
};

export { CopyButton };
