import { FunctionComponent, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink } from "../../services";
import { ShortUrlData } from "../../interfaces";
import type { Url } from "../../schemas";
import { urlSchema } from "../../schemas";

interface UrlFormProps {
  onSuccess: (urlData: ShortUrlData) => void;
};

const UrlForm: FunctionComponent<UrlFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<Url>({ resolver: zodResolver(urlSchema) });

    const submitLongUrl = useCallback(async (longUrl: string) => {
        const { data } = await createShortLink(longUrl);
        onSuccess(data);
        reset();
    }, [onSuccess, reset]);

    const onFormSubmit = handleSubmit((url) => submitLongUrl(url.longUrl));

    return (
        <form onSubmit={onFormSubmit} noValidate>
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
                {errors.longUrl ? errors.longUrl.message : null}
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
