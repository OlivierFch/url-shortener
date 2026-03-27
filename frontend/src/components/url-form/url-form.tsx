import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink, getCategories } from "../../services";
import { ApiError, UrlData, CategoryOption } from "../../interfaces";
import type { Url } from "../../schemas";
import { urlSchema } from "../../schemas";
import "./url-form.scss";

interface UrlFormProps {
    onSuccess: (urlData: UrlData) => void;
};

const DEFAULT_CATEGORY_OPTION: CategoryOption = { value: "", label: "Aucune catégorie" };

const UrlForm: FunctionComponent<UrlFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset
    } = useForm<Url>({ resolver: zodResolver(urlSchema) });
    const [messageValue, setMessageValue] = useState<string | null>(null);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([DEFAULT_CATEGORY_OPTION]);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    const errorMsg = errors.longUrl?.message as string | undefined;
    const successMsg = !errorMsg && messageValue ? String(messageValue) : undefined;

    const feedbackText = errorMsg ?? successMsg ?? "";

    let feedbackClass = "url-form__error-or-message";
    if (errorMsg) {
        feedbackClass += " is-error";
    } else if (successMsg) {
        feedbackClass += " is-success";
    }

    useEffect(() => {
        let isMounted = true;
        getCategories()
            .then((response) => {
                if (!isMounted) return;
                setCategoryError(null);
                setCategoryOptions([DEFAULT_CATEGORY_OPTION, ...response.data]);
            })
            .catch((error) => {
                if (!isMounted) return;
                console.error("Failed to fetch categories", error);
                setCategoryError("Impossible de charger les catégories");
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const submitLongUrl = useCallback(async ({ longUrl, category }: Url) => {
        try {
            const categoryPayload = category ? category : undefined;
            const { data, message } = await createShortLink(longUrl, categoryPayload);
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

    const onFormSubmit = handleSubmit((url) => submitLongUrl(url));

    return (
        <form onSubmit={onFormSubmit} className="url-form">
            <input
                id="longUrl"
                {...register("longUrl")}
                placeholder="https://exemple.com/article..."
                className="url-form__input"
            />
            <label className="url-form__label">
                Catégorie
                <select id="category" {...register("category")} className="url-form__select">
                    {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            {categoryError && (
                <p className="url-form__category-error" role="status">
                    {categoryError}
                </p>
            )}
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
