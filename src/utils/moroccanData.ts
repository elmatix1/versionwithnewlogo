
/**
 * Suggestions de données marocaines pour les formulaires
 */

export const moroccanData = {
  // Noms et prénoms marocains
  names: [
    "Mohamed Amine",
    "Fatima Zahra",
    "Rachid El Idrissi",
    "Salma Benkirane",
    "Karim Alaoui",
    "Amal Chaoui",
    "Youssef Tazi",
    "Nadia El Fassi",
    "Omar Benjelloun",
    "Leila Bensouda",
    "Hamza El Amrani",
    "Saida Lahrichi",
    "Nabil El Hamdaoui",
    "Samira Bennani",
    "Khalid El Ouazzani"
  ],
  
  // CIN (Cartes d'identité nationales)
  cin: [
    "AB123456",
    "K456789",
    "X987654",
    "J234567",
    "BE789012",
    "C345678",
    "D901234",
    "E567890",
    "F123456",
    "G789012"
  ],
  
  // Villes marocaines
  cities: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda",
    "Tétouan",
    "Nador",
    "Kenitra",
    "El Jadida",
    "Essaouira",
    "Dakhla",
    "Laâyoune"
  ],
  
  // Rues et avenues marocaines
  streets: [
    "Boulevard Mohammed V",
    "Rue Hassan II",
    "Avenue des FAR",
    "Boulevard Zerktouni",
    "Avenue Mohammed VI",
    "Boulevard Anfa",
    "Rue Ibn Batouta",
    "Avenue Allal El Fassi",
    "Boulevard Moulay Youssef",
    "Rue Abdelkrim El Khattabi",
    "Avenue Moulay Ismail",
    "Boulevard La Résistance",
    "Rue Al Moutanabi",
    "Avenue de la Mecque",
    "Boulevard Al Massira"
  ],
  
  // Quartiers marocains
  neighborhoods: [
    "Maârif",
    "Habous",
    "Guéliz",
    "Agdal",
    "Hassan",
    "Fès-Médina",
    "Soussi",
    "Al Hoceima",
    "Derb Sultan",
    "Hay Mohammadi",
    "Californie",
    "Hay Hassani",
    "Racine",
    "Gauthier",
    "Bourgogne"
  ],
  
  // Codes postaux marocains
  zipCodes: [
    "10000",  // Rabat
    "20000",  // Casablanca
    "30000",  // Fès
    "40000",  // Marrakech
    "50000",  // Meknès
    "60000",  // Oujda
    "70000",  // Laâyoune
    "80000",  // Agadir
    "90000",  // Tanger
    "24000"   // El Jadida
  ],
  
  // Numéros de téléphone marocains
  phoneNumbers: [
    "+212 6 12 34 56 78",
    "+212 7 23 45 67 89",
    "+212 6 98 76 54 32",
    "+212 7 65 43 21 09",
    "+212 6 54 32 10 98",
    "+212 7 32 10 98 76",
    "+212 6 21 09 87 65",
    "+212 7 10 98 76 54"
  ]
};

/**
 * Fonction pour obtenir une suggestion aléatoire
 */
export const getRandomSuggestion = (categoryName: keyof typeof moroccanData): string => {
  const category = moroccanData[categoryName];
  return category[Math.floor(Math.random() * category.length)];
};

/**
 * Fonction pour filtrer des suggestions en fonction d'un terme de recherche
 */
export const filterSuggestions = (
  categoryName: keyof typeof moroccanData, 
  searchTerm: string
): string[] => {
  const category = moroccanData[categoryName];
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  
  return category.filter(item => 
    item.toLowerCase().includes(lowercaseSearchTerm)
  );
};
