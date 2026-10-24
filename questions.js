// Fragenkatalog für das Quiz „AWS AI Practitioner“.
// "answer" ist der Index (ab 0) der richtigen Antwort in "options".
const QUESTIONS = [
  {
    id: 1,
    domain: "Grundlagen von KI und ML",
    question: "Welche Aussage beschreibt die Beziehung zwischen KI, Machine Learning (ML) und Deep Learning korrekt?",
    options: [
      "KI ist eine Teilmenge von ML, das wiederum eine Teilmenge von Deep Learning ist",
      "Deep Learning ist eine Teilmenge von ML, das wiederum eine Teilmenge von KI ist",
      "ML und Deep Learning sind Synonyme und unabhängig von KI",
      "KI ist eine Art von Deep Learning, die nur für Bilder verwendet wird"
    ],
    answer: 1,
    explanation: "KI ist das umfassendste Gebiet. ML ist ein Ansatz innerhalb der KI, und Deep Learning nutzt tiefe neuronale Netze und ist Teil von ML."
  },
  {
    id: 2,
    domain: "Grundlagen von KI und ML",
    question: "Ein Unternehmen hat einen Bestand an E-Mails, die als „Spam“ oder „kein Spam“ markiert sind, und möchte ein Modell trainieren, das neue E-Mails klassifiziert. Um welche Art des Lernens handelt es sich?",
    options: [
      "Unüberwachtes Lernen",
      "Überwachtes Lernen",
      "Bestärkendes Lernen (Reinforcement Learning)",
      "Clustering"
    ],
    answer: 1,
    explanation: "Wenn die Trainingsdaten bereits Labels (die erwartete Antwort) enthalten, handelt es sich um überwachtes Lernen."
  },
  {
    id: 3,
    domain: "Grundlagen von KI und ML",
    question: "Ein Modell erreicht 99 % Genauigkeit auf den Trainingsdaten, schneidet bei neuen Daten aber schlecht ab. Was ist das wahrscheinlichste Problem?",
    options: [
      "Underfitting (das Modell ist zu einfach)",
      "Overfitting",
      "Hohe Inferenzlatenz",
      "Fehlende Hyperparameter"
    ],
    answer: 1,
    explanation: "Overfitting liegt vor, wenn das Modell die Trainingsdaten auswendig lernt und nicht auf Daten verallgemeinert, die es noch nie gesehen hat."
  },
  {
    id: 4,
    domain: "Grundlagen von KI und ML",
    question: "Mit welchem AWS-Service lassen sich ML-Modelle durchgängig erstellen, trainieren und bereitstellen?",
    options: [
      "Amazon Polly",
      "Amazon Translate",
      "Amazon SageMaker AI",
      "Amazon Rekognition"
    ],
    answer: 2,
    explanation: "SageMaker AI deckt den gesamten ML-Lebenszyklus ab. Polly wandelt Text in Sprache um, Translate übersetzt Texte und Rekognition analysiert Bilder und Videos mit vortrainierten Modellen."
  },
  {
    id: 5,
    domain: "Grundlagen von KI und ML",
    question: "Ein Unternehmen möchte Text, Tabellen und Formularfelder aus eingescannten Dokumenten extrahieren. Welcher Service eignet sich am besten?",
    options: [
      "Amazon Comprehend",
      "Amazon Transcribe",
      "Amazon Textract",
      "Amazon Kendra"
    ],
    answer: 2,
    explanation: "Textract bietet fortgeschrittene OCR und extrahiert Text, Tabellen und Formulare. Comprehend analysiert Text (NLP), Transcribe wandelt Audio in Text um und Kendra ist eine intelligente Suche."
  },
  {
    id: 6,
    domain: "Grundlagen generativer KI",
    question: "Was ist ein Foundation Model (Basismodell)?",
    options: [
      "Ein kleines Modell, das von Grund auf für eine einzige Aufgabe trainiert wird",
      "Ein großes, auf einer enormen Datenmenge vortrainiertes Modell, das an viele Aufgaben angepasst werden kann",
      "Eine Vektordatenbank",
      "Eine Sammlung von Hand geschriebener Geschäftsregeln"
    ],
    answer: 1,
    explanation: "Foundation Models werden auf breiten Daten vortrainiert und für viele Aufgaben wiederverwendet, etwa per Prompt, RAG oder Fine-Tuning."
  },
  {
    id: 7,
    domain: "Grundlagen generativer KI",
    question: "Welche Rolle spielen Embeddings in Anwendungen der generativen KI?",
    options: [
      "Sie verschlüsseln die Prompts",
      "Sie stellen Texte oder Bilder als numerische Vektoren dar, die Bedeutung erfassen",
      "Sie senken die GPU-Kosten",
      "Sie speichern den Gesprächsverlauf"
    ],
    answer: 1,
    explanation: "Embeddings ermöglichen den Vergleich von Bedeutung über die Nähe von Vektoren. Sie sind die Grundlage für semantische Suche und RAG."
  },
  {
    id: 8,
    domain: "Grundlagen generativer KI",
    question: "Welcher Inferenzparameter steuert den Grad an Zufälligkeit (Kreativität) in den Antworten eines LLM?",
    options: [
      "Max tokens",
      "Temperature",
      "Stop sequences",
      "Batch size"
    ],
    answer: 1,
    explanation: "Eine höhere Temperature erzeugt vielfältigere Antworten, eine niedrigere vorhersehbarere. Max tokens begrenzt nur die Länge der Antwort."
  },
  {
    id: 9,
    domain: "Anwendungen von Foundation Models",
    question: "Welcher AWS-Service bietet vollständig verwalteten API-Zugriff auf Foundation Models verschiedener Anbieter?",
    options: [
      "Amazon Macie",
      "AWS Artifact",
      "Amazon Bedrock",
      "Amazon Transcribe"
    ],
    answer: 2,
    explanation: "Amazon Bedrock bietet über eine einheitliche API Zugriff auf zahlreiche Foundation Models, ohne dass Sie Infrastruktur verwalten müssen."
  },
  {
    id: 10,
    domain: "Anwendungen von Foundation Models",
    question: "Wie lassen sich Halluzinationen reduzieren, indem man dem Modell Zugriff auf interne, aktuelle Dokumente gibt, ohne es neu zu trainieren?",
    options: [
      "Ein neues Foundation Model von Grund auf trainieren",
      "RAG (Retrieval-Augmented Generation) verwenden",
      "Die Temperature erhöhen",
      "Den Prompt kürzen"
    ],
    answer: 1,
    explanation: "Bei RAG werden relevante Abschnitte aus Ihren Dokumenten abgerufen und im Prompt mitgesendet, sodass die Antwort auf echten Daten basiert."
  },
  {
    id: 11,
    domain: "Anwendungen von Foundation Models",
    question: "Welche Technik wird verwendet, wenn man dem Prompt einige Beispiele für Eingaben und gewünschte Ausgaben beifügt, um das Modell zu leiten?",
    options: [
      "Zero-Shot-Prompting",
      "Few-Shot-Prompting",
      "Fine-Tuning",
      "Prompt Injection"
    ],
    answer: 1,
    explanation: "Few-Shot nutzt wenige Beispiele direkt im Prompt. Zero-Shot kommt ohne Beispiele aus, und Fine-Tuning verändert die Gewichte des Modells."
  },
  {
    id: 12,
    domain: "Anwendungen von Foundation Models",
    question: "Welche Metrik wird häufig verwendet, um die Qualität automatisch erzeugter Zusammenfassungen im Vergleich zu Referenzzusammenfassungen zu bewerten?",
    options: [
      "ROUGE",
      "RMSE",
      "AUC-ROC",
      "Konfusionsmatrix"
    ],
    answer: 0,
    explanation: "ROUGE misst die Überschneidung zwischen der erzeugten und der Referenzzusammenfassung. BLEU ist typisch für Übersetzungen, und BERTScore misst semantische Ähnlichkeit."
  },
  {
    id: 13,
    domain: "Verantwortungsvolle KI",
    question: "Welches Tool hilft dabei, Verzerrungen (Bias) in Daten und Modellen zu erkennen und die Vorhersagen eines ML-Modells zu erklären?",
    options: [
      "AWS Shield",
      "Amazon SageMaker Clarify",
      "Amazon CloudFront",
      "AWS Config"
    ],
    answer: 1,
    explanation: "SageMaker Clarify erkennt Bias und liefert Erklärbarkeit und unterstützt so Praktiken verantwortungsvoller KI."
  },
  {
    id: 14,
    domain: "Verantwortungsvolle KI",
    question: "Mit welcher Funktion von Amazon Bedrock lassen sich unerwünschte Themen blockieren und schädliche Inhalte in den Ein- und Ausgaben des Modells filtern?",
    options: [
      "Knowledge Bases",
      "Agents",
      "Guardrails",
      "Provisioned Throughput"
    ],
    answer: 2,
    explanation: "Guardrails for Amazon Bedrock wendet Inhaltsfilter, gesperrte Themen und den Schutz sensibler Daten an."
  },
  {
    id: 15,
    domain: "Sicherheit, Compliance und Governance",
    question: "Wer ist im Modell der geteilten Verantwortung von AWS für die Zugriffskontrolle (IAM) und die Daten zuständig, die der Kunde an einen KI-Service sendet?",
    options: [
      "Immer AWS",
      "Der Kunde",
      "Ausschließlich der Modellanbieter",
      "Der Compliance-Prüfer"
    ],
    answer: 1,
    explanation: "AWS ist für die Sicherheit DER Cloud verantwortlich. Der Kunde ist für die Sicherheit IN der Cloud verantwortlich: Berechtigungen, Daten und Konfigurationen."
  }
];
