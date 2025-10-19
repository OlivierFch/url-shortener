import { FunctionComponent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink } from "../../services";
import { ApiError, UrlData } from "../../interfaces";
import type { Url } from "../../schemas";
import { urlSchema } from "../../schemas";
import "./url-form.scss";

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

    const errorMsg = errors.longUrl?.message as string | undefined;
    const successMsg = !errorMsg && messageValue ? String(messageValue) : undefined;

    const feedbackText = errorMsg ?? successMsg ?? "";

    let feedbackClass = "url-form__error-or-message";
    if (errorMsg) {
    feedbackClass += " is-error";
    } else if (successMsg) {
    feedbackClass += " is-success";
    }

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
        <form onSubmit={onFormSubmit} className="url-form">
            <label htmlFor="longUrl" className="url-form__label">
                Url to shorten
            </label>
            <input
                id="longUrl"
                {...register("longUrl")}
                placeholder="https://exemple.com/article..."
                className="url-form__input"
            />
            <div className={feedbackClass} role="status" aria-live="polite">
                {feedbackText}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="url-form__submit-button"
            >
                {isSubmitting ? "Loading" : "Shorten"}
            </button>
        </form>
    );
};

export { UrlForm };
