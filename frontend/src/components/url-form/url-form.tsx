import { FunctionComponent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink } from "../../services";
import { ApiError, UrlData } from "../../interfaces";
import type { Url } from "../../schemas";
import { urlSchema } from "../../schemas";

interface UrlFormProps {
  onSuccess: (urlData: UrlData) => void;
};

const UrlForm: FunctionComponent<UrlFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset
    } = useForm<Url>({ resolver: zodResolver(urlSchema) });
    const [messageValue, setMessageValue] = useState<string | null>(null);

    const submitLongUrl = useCallback(async (longUrl: string) => {
        try {
            const { data, message } = await createShortLink(longUrl);
            onSuccess(data);
            setMessageValue(message);
            reset();
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 400) {
                    setError("longUrl", {
                    type: "server",
                    message: error.detail ?? error.title,
                    });
                    return;
                }

                setError("root.server", {
                    type: "server",
                    message: error.detail ? `${error.title} — ${error.detail}` : error.title,
                });
                return;
            }
            setError("root.server", {
                type: "unknown",
                message: "Une erreur inattendue est survenue. Réessaie plus tard.",
            });
        }
    }, [onSuccess, reset]);

    const onFormSubmit = handleSubmit((url) => submitLongUrl(url.longUrl));

    return (
        <form onSubmit={onFormSubmit}>
            <label htmlFor="longUrl" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                Url to shorten
            </label>
            <input
                id="longUrl"
                {...register("longUrl")}
                placeholder="https://exemple.com/article..."
                spellCheck={false}
                autoComplete="off"
                style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                border: "1px solid #ccc", outline: "none"
                }}
            />
            <div style={{ minHeight: 18, fontSize: 13, marginTop: 6, color: errors.longUrl ? "#ef4444" : "#6b7280" }}>
                {errors.longUrl?.message ?? messageValue}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    marginTop: 12, padding: "10px 14px", borderRadius: 8,
                    border: "none", cursor: "pointer", background: "#60a5fa", color: "#0b1020", fontWeight: 700
                }}
            >
                {isSubmitting ? "Loading" : "Shorten"}
            </button>
        </form>
    );
};

export { UrlForm };
