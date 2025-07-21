export const Footer = () => {
  return (
    <footer className="container mx-auto px-4 mt-12">
      <div className="text-center py-6 border-t border-border/50">
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          <strong>Avis de non-responsabilité :</strong> Cet outil est destiné à des fins de simulation et d'information uniquement. Les calculs sont basés sur les informations que vous fournissez et les lois fiscales en vigueur à ce jour. Il ne remplace pas les conseils d'un professionnel de la comptabilité ou de la fiscalité. Veuillez consulter un expert qualifié pour des conseils spécifiques à votre situation.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} Outil 35. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};
