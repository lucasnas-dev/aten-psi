import {
  formatDeclarationDate,
  type IssuedDeclaration,
} from "@/lib/documents/declaration";

import styles from "./declaration-print.module.css";

export function DeclarationTemplate({
  document,
}: {
  document: IssuedDeclaration;
}) {
  const { content } = document;
  return (
    <article className={styles.sheet} aria-labelledby="declaration-title">
      <h1 id="declaration-title" className={styles.title}>
        Declaração
      </h1>
      <dl className={styles.details}>
        <div>
          <dt>Nome da pessoa atendida</dt>
          <dd>{content.patientName}</dd>
        </div>
        {content.companionName && (
          <div>
            <dt>Nome do acompanhante</dt>
            <dd>{content.companionName}</dd>
          </div>
        )}
        <div>
          <dt>Finalidade</dt>
          <dd>{document.purpose}</dd>
        </div>
        <div>
          <dt>Destinatário</dt>
          <dd>{document.recipient}</dd>
        </div>
        <div>
          <dt>Local do comparecimento</dt>
          <dd>{content.attendanceLocation}</dd>
        </div>
        <div>
          <dt>Dias / datas</dt>
          <dd>{content.attendanceDates}</dd>
        </div>
        <div>
          <dt>Horários</dt>
          <dd>{content.attendanceTimes}</dd>
        </div>
        <div>
          <dt>Duração do acompanhamento</dt>
          <dd>{content.attendanceDuration}</dd>
        </div>
      </dl>
      <footer className={styles.footer}>
        <p>
          {content.issuanceLocation}, {formatDeclarationDate(document.issuedOn)}
          .
        </p>
        <div className={styles.signature}>
          <div className={styles.signatureLine} />
          <p>{content.professionalName}</p>
          <p>CRP: {content.professionalCrp}</p>
          <p>Carimbo e assinatura do profissional</p>
        </div>
      </footer>
    </article>
  );
}
