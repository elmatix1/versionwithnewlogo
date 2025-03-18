
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
    "Khalid El Ouazzani",
    "Hamza Bouzid",
    "Khadija Bakkali",
    "Samira Benmoussa",
    "Younes Benslimane",
    "Houda Khaldi",
    "Othmane Bennani",
    "Hajar Lahbabi",
    "Mehdi Touzani",
    "Nawal Kadiri",
    "Ali Benjelloun"
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
    "G789012",
    "BK123456",
    "CD456789",
    "EE654321",
    "BH987654",
    "JB112233",
    "HH445566",
    "T123123",
    "M678900",
    "Z554433",
    "L897621"
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
    "Laâyoune",
    "Mohammedia",
    "Ifrane",
    "Ouarzazate",
    "Safi",
    "Béni Mellal",
    "Errachidia",
    "Chefchaouen",
    "Larache",
    "Khémisset",
    "Taourirt"
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
    "Boulevard Al Massira",
    "Rue Oued Eddahab",
    "Boulevard Lalla Yacout",
    "Avenue Hassan I",
    "Rue Ibn Rochd",
    "Boulevard Oued Sebou",
    "Avenue 2 Mars",
    "Rue Tarik Ibn Ziad",
    "Boulevard Bir Anzarane",
    "Avenue Al Maghrib Al Arabi",
    "Rue Ibn Sina"
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
    "Bourgogne",
    "Anfa",
    "La Palmerie",
    "Ryad",
    "Targa",
    "Hay Riad",
    "Ain Diab",
    "Hay Inara",
    "Sidi Moumen",
    "Hay El Fath",
    "Sidi Belyout"
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
    "24000",  // El Jadida
    "14000",  // Kénitra
    "28000",  // Mohammedia
    "53000",  // Ifrane
    "45000",  // Ouarzazate
    "26000",  // Safi
    "23000",  // Béni Mellal
    "52000",  // Errachidia
    "91000",  // Chefchaouen
    "92000",  // Larache
    "15000"   // Khémisset
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
    "+212 7 10 98 76 54",
    "+212 6 61 23 45 67",
    "+212 7 70 12 34 56",
    "+212 6 33 44 55 66",
    "+212 7 45 67 89 01",
    "+212 6 22 33 44 55",
    "+212 7 34 56 78 90",
    "+212 6 11 22 33 44",
    "+212 7 55 66 77 88"
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

/**
 * Validation du format CIN marocain
 */
export const validateCIN = (cin: string): boolean => {
  const cinRegex = /^[A-Z]{1,2}[0-9]{6}$/;
  return cinRegex.test(cin);
};

/**
 * Formatte un numéro de téléphone marocain
 * +212 6XX XX XX XX ou +212 7XX XX XX XX
 */
export const formatPhoneNumber = (phone: string): string => {
  // Supprime tous les caractères non numériques
  const digits = phone.replace(/\D/g, '');
  
  // Vérifie si le numéro est déjà au format marocain
  if (digits.startsWith('212') && (digits.length === 11 || digits.length === 12)) {
    const prefix = digits.substring(0, 3);
    const operator = digits.substring(3, 4);
    const part1 = digits.substring(4, 6);
    const part2 = digits.substring(6, 8);
    const part3 = digits.substring(8, 10);
    
    return `+${prefix} ${operator} ${part1} ${part2} ${part3}`;
  }
  
  // Sinon on traite le format national
  if (digits.startsWith('0') && digits.length === 10) {
    const operator = digits.substring(1, 2);
    const part1 = digits.substring(2, 4);
    const part2 = digits.substring(4, 6);
    const part3 = digits.substring(6, 8);
    const part4 = digits.substring(8, 10);
    
    return `+212 ${operator} ${part1} ${part2} ${part3}`;
  }
  
  // Si le format n'est pas reconnu, retourne tel quel
  return phone;
};
