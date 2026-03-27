import { useEffect, useMemo, useState } from "react";
import { TopLinksResponse, TopLinksWindow } from "../../interfaces";
import { getTopLinks } from "../../services";
import "./top-urls.scss";

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const WINDOW_LABELS: Record<TopLinksWindow, string> = {
  previous: "Mois précédent",
  current: "Mois courant"
};

const TopUrls = () => {
  const [data, setData] = useState<TopLinksResponse["data"] | null>(null);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: true, error: null });
  const [selectedWindow, setSelectedWindow] = useState<TopLinksWindow>("current");

  useEffect(() => {
    let isMounted = true;
    setState({ loading: true, error: null });
    setData(null);
    getTopLinks(selectedWindow)
      .then((response) => {
        if (!isMounted) return;
        setData(response.data);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : "Impossible de récupérer les statistiques";
        setState({ loading: false, error: message });
      })
      .finally(() => {
        if (!isMounted) return;
        setState((prev) => ({ ...prev, loading: false }));
      });
    return () => {
      isMounted = false;
    };
  }, [selectedWindow]);

  const periodLabel = useMemo(() => {
    if (!data) return "Chargement de la période";
    return `Période du ${formatDate(data.periodStart)} au ${formatDate(data.periodEnd)}`;
  }, [data]);

  const isEmpty = state.loading === false && !state.error && (!data || !data.categories.length);

  return (
    <section className="top-urls">
      <header className="top-urls__header">
        <div>
          <p className="top-urls__eyebrow">Top URLs — {WINDOW_LABELS[selectedWindow]}</p>
          <p className="top-urls__period">{periodLabel}</p>
        </div>
        <div className="top-urls__toggle-group" role="group" aria-label="Fenêtre temporelle">
          {(Object.keys(WINDOW_LABELS) as TopLinksWindow[]).map((window) => (
            <button
              type="button"
              key={window}
              className={`top-urls__toggle ${selectedWindow === window ? "top-urls__toggle--active" : ""}`}
              onClick={() => setSelectedWindow(window)}
            >
              {WINDOW_LABELS[window]}
            </button>
          ))}
        </div>
      </header>
      <div className="top-urls__content">
        {state.loading && <p className="top-urls__status">Chargement en cours...</p>}
        {state.error && <p className="top-urls__status top-urls__status--error">{state.error}</p>}
        {isEmpty && <p className="top-urls__status">Aucune visite enregistrée pour cette période.</p>}
        {!state.loading && !state.error && data && data.categories.length > 0 && (
          <div className="top-urls__grid">
            {data.categories.map((category) => {
              const groupKey = category.category ?? category.categoryLabel;
              return (
                <article key={groupKey} className="top-urls__card">
                  <div className="top-urls__card__header">
                    <p className="top-urls__card__category">{category.categoryLabel}</p>
                    <span className="top-urls__card__count">{category.links.length} lien{category.links.length > 1 ? "s" : ""}</span>
                  </div>
                  <ul className="top-urls__list">
                    {category.links.map((link) => (
                      <li key={link.slug} className="top-urls__list__item">
                        <div>
                          <p className="top-urls__list__slug">{link.slug}</p>
                          <p className="top-urls__list__long-url" title={link.longUrl}>{link.longUrl}</p>
                        </div>
                        <div className="top-urls__list__meta">
                          <span className="top-urls__list__hits">{link.monthlyHits} visites</span>
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="top-urls__list__short-url"
                          >
                            Voir
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export { TopUrls };
