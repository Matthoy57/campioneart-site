import { CheckIcon } from "./icons";
import { archivo, CREAM, LIME, MONO_MUTED } from "./platformTheme";

const BENEFITS = [
  "Tous les outils que je construis pour mon propre développement",
  "Des guides et breakdowns dès que j'ai quelque chose qui vaut le coup d'être partagé",
  "Des réponses prioritaires : questions, retours, ce dont tu as besoin",
  "Le rôle membre sur le Discord",
];

// Section "ce que les membres reçoivent" : liste à puces + petit mot personnel + garantie, dans
// l'esprit des pages d'offre à la Discord/Whop plutôt qu'un mur de features génériques.
export function MembersSection() {
  return (
    <section style={{ background: CREAM, color: "#111110", padding: "80px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ ...archivo, fontSize: "clamp(24px, 3vw, 34px)", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 32px" }}>
          CE QUE LES MEMBRES REÇOIVENT
        </h2>

        <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
          {BENEFITS.map((benefit) => (
            <li key={benefit} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15, lineHeight: 1.4 }}>
              <span
                aria-hidden
                style={{
                  marginTop: 2,
                  flex: "none",
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: "2px solid #111110",
                  background: LIME,
                  color: "#111110",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon size={11} strokeWidth={3.2} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.6, color: "#4a4738" }}>
          Je suis développeur et je construis mes outils pour mon propre usage. Ce que tu retrouves ici, ce sont ceux que j&apos;utilise vraiment.
          Si ça peut te servir, 20€/mois te donne accès à tout. Sinon, pas de souci.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#111110",
            color: LIME,
            border: "2px solid #111110",
            borderRadius: 10,
            padding: "10px 16px",
            ...archivo,
            fontSize: 12,
          }}
        >
          🛡️ GARANTIE 15 JOURS SATISFAIT OU REMBOURSÉ
        </div>
        <p style={{ margin: "10px auto 0", maxWidth: 420, fontSize: 12, lineHeight: 1.5, color: MONO_MUTED }}>
          Écris-moi dans les 15 jours suivant ton abonnement et tu es remboursé, sans justification.
        </p>
      </div>
    </section>
  );
}
