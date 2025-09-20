// top of src/data/products.ts (above export)
console.log('*** LOADED products.ts (runtime) ***');


import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Shell necklace',
    price: 450,
    originalPrice: 700,
    description: 'Multi-layered beads waistbead with shells',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757532389/IG__gazelle_accessory_xmk77w.jpg',
    category: 'Waistbead',
    rating: 4.8,
    reviewCount: 1247,
    inStock: true,
    tags: ['necklace', 'shells', 'Multi-layered'],
    variants: [
      {
        id: 'shell-natural',
        color: 'Blue',
        colorHex: '#F5F5DC',
        images: [
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757532389/IG__gazelle_accessory_xmk77w.jpg',
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757531528/download_2_vzstyi.jpg'
        ],
        inStock: true,
        sku: 'SHELL-NAT-001'
      },
      {
        id: 'shell-pink',
        color: 'Pink',
        colorHex: '#FFD700',
        images: [
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757532409/%E1%A5%AB_1_s6xxca.jpg',
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757532409/%E1%A5%AB_1_s6xxca.jpg'
        ],
        price: 480,
        inStock: true,
        sku: 'SHELL-GOLD-001'
      }
    ]
  },
  {
    id: 2,
    name: 'Sea-themed bead necklace',
    price: 120,
    description: 'Beautiful sea-themed bead necklace',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757531528/download_2_vzstyi.jpg',
    category: 'Necklace',
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    tags: ['Necklace', 'sea', 'bead']
  },
  {
    id: 3,
    name: 'Gold necklace',
    price: 199.99,
    originalPrice: 249.99,
    description: 'Gold shell necklace',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757531544/download_oluw9g.jpg',
    category: 'Necklace',
    rating: 4.7,
    reviewCount: 2156,
    inStock: true,
    tags: ['necklace', 'gold', 'bead']
  },
  {
    id:5,
    name: 'Flower gold necklace',
    price: 24.99,
    description: 'Handcrafted flower gold necklace with multi-layered beads.',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757533616/Honolulu_Necklace_vjvcxr.jpg',
    category: 'Necklace',
    rating: 4.8,
    reviewCount: 324,
    inStock: true,
    tags: ['Necklace', 'multi-layered', 'gold']
  },
  {
    id: 6,
    name: 'Gold-chained waist bead with multi-layered beads',
    price: 49.99,
    originalPrice: 69.99,
    description: 'Handcrafted gold-chained waist bead with multi-layered beads.',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757532322/Refresh_cyvc7q.jpg',
    category: 'Waistbead',
    rating: 4.5,
    reviewCount: 789,
    inStock: true,
    tags: ['Waistbead', 'multi-layered', 'beaded' , 'gold-chained']
  },
  {
    id: 7,
    name: 'Layered waist beads',
    price: 34.99,
    description: 'Handcrafted pearl waist beads with multi-layered beads.',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757532322/Refresh_cyvc7q.jpg',
    category: 'Waistbead',
    rating: 4.7,
    reviewCount: 445,
    inStock: true,
    tags: ['Waistbead', 'multi-layered', 'beaded' , 'pearl']
  },
  {
    id: 8,
    name: 'Multi-layered gold necklace',
    price: 79.99,
    description: ' Multi-layered gold necklace.',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757533597/Women_s_Fashion_Bohemian_Jewelry_Gold_Multilayered_Link_Pearl_Necklace_294-32___eBay_ctnyv2.jpg',
    category: 'Necklace',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Necklace', 'multi-layered', 'gold']
  },  
  {
    id: 9,
    name: 'Thigh chain',
    price: 79.99,
    description: 'Handcrafted butterfly thigh chain.',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757533672/download_3_vsu72s.jpg',
    category: 'Thighchain',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Thighchain', 'multi-layered', 'gold' , 'butterfly']
  },
  {
    id: 10,
    name: 'Thigh chain',
    price: 79.99,
    description: 'Handcrafted beaded thigh chain.',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757534810/Thigh_chains_vfmqxn.jpg',
    category: 'Thighchain',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Thighchain', 'multi-layered', 'gold' , 'beaded']
  },
  {
    id: 11,
    name: 'Bracelet',
    price: 79.99,
    description: 'Beaded bracelet with pendant',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757534823/Beaded_Winter_Themed_Bracelet_Y2K_Bracelet_Handmade_Beaded_Bracelet_Steel_Blue_Bracelet_Detailed_Charm_Bracelet_sysmyg.jpg',
    category: 'Bracelets',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Bracelets', 'gold' , 'beaded'],
    variants: [
      {
        id: 'bracelet-blue',
        color: 'Steel Blue',
        colorHex: '#4682B4',
        images: [
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757534823/Beaded_Winter_Themed_Bracelet_Y2K_Bracelet_Handmade_Beaded_Bracelet_Steel_Blue_Bracelet_Detailed_Charm_Bracelet_sysmyg.jpg'
        ],
        inStock: true,
        sku: 'BRAC-BLUE-001'
      },
      {
        id: 'bracelet-green',
        color: 'Olive Green',
        colorHex: '#808000',
        images: [
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757535103/download_7_xps1ts.jpg'
        ],
        inStock: true,
        sku: 'BRAC-GREEN-001'
      },
      {
        id: 'bracelet-coquette',
        color: 'Coquette Pink',
        colorHex: '#FFB6C1',
        images: [
          'https://res.cloudinary.com/dozb1abfn/image/upload/v1757535126/coquette_bracelet__3_olhmie.jpg'
        ],
        price: 84.99,
        inStock: true,
        sku: 'BRAC-PINK-001'
      }
    ]
  },
  {
    id: 12,
    name: 'Bracelet',
    price: 79.99,
    description: 'Coquette bracelet with pendant',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757535089/Gift_ideas_p8r2jc.jpg',
    category: 'Bracelets',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Bracelets', 'coquette' , 'beaded']
  },
  {
    id: 13,
    name: 'Bracelet',
    price: 79.99,
    description: 'Moon bracelet',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757769752/Small_Bracelets_Drop____How_to_purchase__linked_in_bio_depop_vinted_or_dm_me_to_order__-vinted_currently_unavailable_for_new_products-____i_do_not_place_orders_from_dms_i_only_take_orders_from_depop_2_f6ibz2.jpg',
    category: 'Bracelets',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Bracelets', 'moon' , 'beaded']
  },
  {
    id: 14,
    name: 'Bracelet',
    price: 79.99,
    description: 'Purple beaded bracelet',
    image: 'https://res.cloudinary.com/dozb1abfn/image/upload/v1757769760/download_9_mmz2d9.jpg',
    category: 'Bracelets',
    rating: 4.6,
    reviewCount: 1123,
    inStock: true,
    tags: ['Bracelets', 'olive green' , 'beaded']
  }
];



export const categories = [
  'All',
  'Necklace',
  'Waistbead',
  'Thighchain',
  'Bracelets',
  'Ring',
  
];