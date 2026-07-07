import type { LongFormSection } from '../calculator-content-engine'

const articles: Record<string, LongFormSection[]> = {
'cabinet-calculator': [
    {
      title: 'What Is Cabinet Layout and Why Does It Matter?',
      content: 'Cabinet layout determines the configuration, dimensions, and quantities of base and wall cabinets needed for a functional kitchen, bathroom, or laundry room. Proper cabinet planning maximizes storage efficiency, ensures appliance fit, and prevents costly ordering errors. A well-calculated cabinet layout accounts for clearances, appliance dimensions, corner solutions, and ergonomic work zones.',
      subsections: [
        { heading: 'Standard Cabinet Dimensions', text: 'Base cabinets are typically 34.5 inches tall (countertop adds 1.5 inches for 36-inch standard height), 24 inches deep, and available in widths of 9, 12, 15, 18, 21, 24, 30, 33, 36, and 48 inches. Wall cabinets are 12-13 inches deep and 12, 18, 30, 36, or 42 inches tall with matching widths. Tall cabinets (pantry cabinets) are 84 or 96 inches tall and 24 inches deep. Understanding these modular sizes allows precise space planning with 3-inch increments.' },
        { heading: 'Kitchen Work Triangle and Clearances', text: 'The kitchen work triangle connects the sink, refrigerator, and cooktop with paths totaling no more than 26 feet and no leg shorter than 4 feet or longer than 9 feet. Countertop workspace requires minimum 36 inches of clear counter on each side of the cooktop, 24 inches on at least one side of the refrigerator, and 24 inches on each side of the sink. Island clearance requires 42-48 inches of walking space on all sides — 36 inches minimum for single-cook kitchens.' },
        { heading: 'Corner Cabinet Solutions', text: 'Corner cabinets waste space without proper planning. Options include: lazy Susan base cabinets (42 inches wide with rotating shelves, $300-600), blind corner cabinets (pull-out shelves that access the deep corner via a pull-out mechanism, $400-800), or diagonal cabinets (saves the corner but reduces usable counter space). For wall corners, corner wall cabinets with angled doors or open shelving avoid the inaccessible dead space of standard wall cabinets meeting at right angles.' },
      ],
    },
    {
      title: 'How the Cabinet Calculator Works',
      content: 'This calculator computes cabinet quantities, sizes, and layout configurations based on room dimensions, desired appliance placement, and clearance requirements. It generates cut sheets and order lists for new construction or remodeling projects.',
      subsections: [
        { heading: 'Wall Measurement and Cabinet Layout', text: 'Measure each wall section between windows, doors, corners, and appliances. A 12-foot wall with a 3-foot window centered leaves 4.5 feet on each side. On the left: 4.5 ft = 54 inches. Using 36-inch + 18-inch base cabinets = 54 inches exactly — a perfect fit. If the remaining space is slightly too large for standard cabinets, add filler strips (1-6 inches wide) to close gaps. The calculator sums total cabinet width and compares to available wall space, distributing fillers as needed for a custom fit.' },
        { heading: 'Cabinet Count and Cost Estimation', text: 'For a typical 150-sq-ft kitchen (10x15): average of 15 base and wall cabinets combined. Using the calculator with your specific wall measurements: total base cabinet width might be 168 inches, total wall cabinet width 144 inches, plus 3 tall cabinets. At $200-500 per base cabinet and $150-400 per wall cabinet (semi-custom RTA cabinets), the cabinet cost range = $5,000-12,000. Premium custom cabinets run $500-1,500 each with the same layout costing $12,000-25,000.' },
        { heading: 'Appliance and Cutout Planning', text: 'Built-in appliances require precise cabinet openings. A 30-inch cooktop needs a base cabinet opening 28.5-29.5 inches wide and 3-5 inches deep. A 24-inch dishwasher needs an adjacent 24-inch base cabinet with a 24-inch wide by 34-35 inch tall opening beneath the countertop. A 36-inch refrigerator requires a surrounding cabinet opening of 37-38 inches wide and 70-72 inches tall for proper ventilation and door swing clearance.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A homeowner is remodeling a 12x14-foot kitchen (168 sq ft) with an existing L-shaped layout. The kitchen has a 48-inch window on one wall and two doorways — one to the dining room and one to the mudroom.',
      subsections: [
        { heading: 'Kitchen Layout Planning', text: 'The L-shaped kitchen has two walls for cabinets: Wall A (14 feet with a 48-inch window) and Wall B (10 feet continuous). Wall A: 168 inches total, minus 48-inch window = 120 inches. Layout: 36-inch sink base (under window) + 24-inch base left + 36-inch base right + 24-inch base right corner = 120 inches. Wall B: 120 inches. Layout: 30-inch cooktop base + 18-inch base left + 36-inch base right + 36-inch corner solution (blind corner with pull-out) = 120 inches.' },
        { heading: 'Cabinet Order and Configuration', text: 'Base cabinets: 36-inch sink base ($400), two 36-inch standard base ($300 each), one 30-inch cooktop base ($450), one 24-inch base ($275), one 18-inch base ($250), corner blind base ($500) = $2,475. Wall cabinets: 36-inch above windows (two at $280 each), 30-inch above cooktop (range hood space), 18-inch above fridge ($220) = $780. Tall pantry: 18-inch pantry cabinet ($600). Countertops: 48 sq ft = $1,200-2,400 for laminate or $3,000-4,800 for quartz. Total cabinet cost: approximately $4,500-5,500 for RTA semi-custom.' },
        { heading: 'Ergonomics and Workflow', text: 'The work triangle: sink (center of Wall A) to cooktop (center of Wall B) = 6 feet; sink to refrigerator (Wall B end) = 8 feet; cooktop to refrigerator = 5 feet. Total triangle = 19 feet — well within the 26-foot maximum. Countertop workspace: 36 inches left of cooktop, 18 inches right; 24 inches on both sides of sink. The primary prep zone (36 inches between sink and cooktop) supports efficient meal preparation with minimal cross-traffic.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Kitchen designers and cabinet installers share these essential tips for a successful cabinet layout and installation.',
      subsections: [
        { heading: 'Order 10-15% Extra for Filler and Modifications', text: 'Stock cabinets may have width variations of 1/16-1/8 inch. Having extra filler strips allows for fine-tuning alignment. Filler strips are simply narrower custom-cut face frames used to close gaps between cabinets and walls or appliances. For a typical kitchen, order 2-3 extra linear feet of filler material — this $30-50 investment prevents visible gaps that look unfinished.' },
        { heading: 'Plan for Crown Molding and Light Rails', text: 'If using crown molding on top of wall cabinets, specify cabinets with a light rail (a 3-4 inch valance across the bottom front) to hide under-cabinet lighting and create a finished look. Crown molding adds 3-6 inches to the cabinet height — ensure the top of the molding has clearance to the ceiling (minimum 2 inches). If ceilings are 96 inches and cabinets are 42 inches tall with 4-inch crown, total = 46 inches — leaving 50 inches above for a full backsplash or bulkhead.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about kitchen cabinet sizing, ordering, and installation for remodeling projects.',
      subsections: [
        { heading: 'Should I use stock, semi-custom, or custom cabinets?', text: 'Stock cabinets ($100-300 each) come in fixed sizes and are best for straightforward layouts with standard measurements. Semi-custom ($200-600 each) offers more sizes and finish options for most remodels. Custom ($500-2,000+ each) provides any size and finish for historic homes or unique layouts. For 90% of kitchens, semi-custom RTA (ready-to-assemble) cabinets offer the best value — custom quality at 40-60% of the cost of fully assembled custom cabinets.' },
        { heading: 'How much space is needed between an island and cabinets?', text: 'Minimum 36 inches, recommended 42-48 inches for multiple cooks. A 36-inch aisle allows one person to work comfortably with appliances open. For an island with seating on the opposite side, you need 44 inches minimum for seated diners to pass behind seated people. Measure from countertop edge (not cabinet face) to island countertop edge — the extra 2-3 inches from countertop overhangs matter.' },
      ],
    },
  ],

  'countertop-calculator': [
    {
      title: 'What Is Countertop Measurement and Why Does It Matter?',
      content: 'Countertop measurement calculates the exact square footage of stone, quartz, or laminate surfaces needed for kitchen or bathroom installations. Accurate measurements prevent costly ordering mistakes — a 10% overage error on a $4,000 quartz countertop means $400 wasted, while an under-measurement causes project delays of 2-4 weeks for additional fabrication. Precise calculation ensures seamless fabrication, correct seam placement, and efficient material use.',
      subsections: [
        { heading: 'Measurement Basics', text: 'Countertops are measured in square feet, calculated as length × width for each section, then summed. Base cabinets are 24 inches deep (countertop depth is 25-26 inches to allow 1-1.5 inches overhang). For L-shaped, U-shaped, or irregular kitchens, measure each straight section individually and break corners into rectangles. Always measure in inches, convert to feet (total inches / 144 = square feet), and round up to the nearest 1/2 square foot per section.' },
        { heading: 'Backsplash and Edge Profiles', text: 'Standard backsplash height is 4 inches from countertop surface (the portion rising up the wall behind the counter). Full-height backsplash to the bottom of wall cabinets is typically 18 inches. Backsplash area adds to the countertop square footage. Edge profiles affect pricing — eased (slightly rounded) and beveled edges are standard, while ogee, bullnose, and waterfall edges add $5-15 per linear foot to fabrication costs.' },
        { heading: 'Seam Placement and Material Yield', text: 'Natural stone slabs come in standard sizes (typically 9×5 feet = 45 sq ft or 10×6 feet = 60 sq ft). Kitchen layouts requiring more than one slab width need seams. A good fabricator places seams at sink cutouts (hidden by the sink rim), at the transition between sections, or in inconspicuous corners. Each seam adds $150-300 to fabrication cost and should be minimized. Seams in granite or quartz are nearly invisible with modern epoxy fill techniques.' },
      ],
    },
    {
      title: 'How the Countertop Calculator Works',
      content: 'This calculator determines the total square footage of countertop material needed, factoring in sink cutouts, backsplash, edge profiles, and overhang requirements. It also estimates material costs and slab requirements.',
      subsections: [
        { heading: 'Square Footage Calculation', text: 'For an L-shaped kitchen with a 10-foot section and an 8-foot section sharing a corner: Section 1: 120 inches × 26 inches (depth) = 3,120 sq in / 144 = 21.67 sq ft. Section 2: 96 inches × 26 inches = 2,496 sq in / 144 = 17.33 sq ft. Subtract corner overlap: 26 × 26 = 676 sq in / 144 = 4.69 sq ft. Net countertop area: 21.67 + 17.33 - 4.69 = 34.31 sq ft. Add 4-inch backsplash: 216 linear inches × 4 inches = 864 sq in / 144 = 6 sq ft. Total: 40.31 sq ft — round up to 41 sq ft for ordering.' },
        { heading: 'Sink and Cutout Deductions', text: 'Sink cutouts do not reduce the material needed (the sink cutout area is waste), but they affect slab layout. A 33×22-inch undermount sink requires a cutout approximately 31×20 inches (620 sq in = 4.3 sq ft). If this cutout falls entirely within one slab, no additional cost. However, if the cutout bridges a seam, the fabricator may need an additional slab — adding $500-800 to material cost. Cooktop cutouts (typically 29×19 inches = 551 sq in) follow the same logic.' },
        { heading: 'Slab Requirements and Cost', text: 'For 41 sq ft of finished countertop, a standard slab (50 sq ft nominal) typically suffices if the layout is well-planned. However, if the countertop requires a single piece over 10 feet long (without seams), you may need a jumbo slab (65-70 sq ft) at a 15-25% premium. Material price: granite $40-100/sq ft installed, quartz $50-150/sq ft, marble $60-200/sq ft, solid surface $40-80/sq ft, laminate $15-40/sq ft. For 41 sq ft quartz: $2,050-6,150 plus fabrication ($500-1,000) and installation ($400-800).' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A homeowner is installing quartz countertops in a 12x14-foot kitchen with an L-shaped layout plus a 5-foot by 3-foot island. The kitchen has a 33-inch undermount sink and a 30-inch cooktop.',
      subsections: [
        { heading: 'Project Measurements', text: 'Wall A (12 ft = 144 inches): 144 × 26 = 3,744 sq in / 144 = 26 sq ft. Wall B (8 ft = 96 inches): 96 × 26 = 2,496 sq in / 144 = 17.33 sq ft. Corner overlap deduction: 26 × 26 = -4.69 sq ft. Island: 60 × 39 inches (15-inch overhang for seating) = 2,340 sq in / 144 = 16.25 sq ft. Backsplash: (144 + 96) × 4 = 960 sq in / 144 = 6.67 sq ft. Total = 26 + 17.33 - 4.69 + 16.25 + 6.67 = 61.56 sq ft — order 62 sq ft.' },
        { heading: 'Slab Layout and Seams', text: 'The L-shaped countertop requires a seam in the corner (33 inches from the corner on the 8-foot leg for a clean look). Total slab needed: one full slab (50 sq ft) for the L-shape plus the island requires a partial slab (12-16 sq ft) — total 62-66 sq ft. Two slabs of quartz = approximately $2,500-4,000 (at $50-80/sq ft for mid-range quartz). One seam at the corner ($200), one seam if island needs to be joined (but ideally a single slab cut avoids island seams).' },
        { heading: 'Total Cost Breakdown', text: 'Material (62 sq ft quartz at $65/sq ft): $4,030. Template and fabrication: $900. Edge profile (eased edge included, upgraded ogee adds $450): $0. Sink cutout: $175. Cooktop cutout: $125. Seam (one seam): $200. Installation: $600. Removal and disposal of old countertops: $250. Tax: $350. Total project cost: approximately $6,630. DIY laminate alternative: 62 sq ft at $25/sq ft = $1,550 — saving $5,000 but with much lower resale value and durability.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Countertop professionals emphasize accurate templating and material selection for successful installations.',
      subsections: [
        { heading: 'Templating Is Critical', text: 'Professional digital templating (using a laser or camera measuring system) captures wall variations of 1/4 inch or more out of plumb, out-of-square corners, and cabinet imperfections. Digital templates cost $150-300 but eliminate the 1-2% error rate of manual measuring. A 1/4-inch gap at the wall on a 10-foot countertop creates a visible gap that requires caulking — acceptably functional but visually obvious to homeowners.' },
        { heading: 'Choose the Right Material for Use', text: 'Quartz is more stain-resistant than granite and requires no sealing — ideal for busy kitchens. Granite requires annual sealing and can stain from wine, oil, and acidic foods. Marble etches from any acidic contact (lemon juice, vinegar, tomato sauce) and is not recommended for heavy-use kitchens. For bathrooms, marble and quartz both work well since acid exposure is minimal. Solid surface materials can be sanded to repair scratches but scorch from hot pans.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about countertop measurement, materials, and installation considerations.',
      subsections: [
        { heading: 'Can I install countertops myself to save money?', text: 'Laminate countertops can be DIY-installed with basic tools ($200-400 in tools). Stone and quartz countertops require professional fabrication and installation — slabs weigh 15-25 pounds per square foot, meaning a 40-sq-ft countertop weighs 600-1,000 pounds. Professional installation ($400-800) includes lifting equipment, seam finishing, and securing the countertop. DIY stone installation almost always leads to cracked slabs or poor seam alignment.' },
        { heading: 'How much overhang is standard on an island?', text: 'Standard island overhang for seating: 12-15 inches, providing knee clearance for seated adults. Minimum for comfortable seating: 12 inches. Maximum without support: 15 inches for stone (beyond 15 inches requires corbels or legs rated for 400+ pounds). Counter-depth overhang (eating side of L-shape): 6-8 inches over standard base cabinets. Measure from the cabinet face, not the countertop edge — a 24-inch cabinet with 15-inch overhang needs a 39-inch countertop depth on the seating side.' },
      ],
    },
  ],

  'backsplash-calculator': [
    {
      title: 'What Is Backsplash Measurement and Why Does It Matter?',
      content: 'Backsplash measurement calculates the precise area of tile or other material needed to cover the wall space between countertops and upper cabinets or ceiling. Accurate calculations prevent tile shortages (delaying projects by weeks) and over-ordering (wasting 20-40% of material budget). Proper backsplash planning accounts for outlets, windows, corners, and pattern waste — turning a simple measurement into a cost-saving skill.',
      subsections: [
        { heading: 'Standard Backsplash Heights', text: 'Standard backsplash height between countertop and upper cabinets ranges from 15-18 inches (the typical distance from countertop to cabinet bottom). Full-height backsplash extends from countertop to ceiling, ranging from 36-42 inches in kitchens with 8-foot ceilings. Bathroom backsplashes behind vanities typically extend 4-6 inches above the countertop. Each configuration requires different area calculations, material quantities, and labor estimates.' },
        { heading: 'Tile Waste Factors', text: 'Waste factor accounts for tile cuts, breakage, and future repairs. Straight-set subway tile (3x6 or 4x8): 10-15% waste. Herringbone or diagonal patterns: 15-20% waste. Mosaic sheets (12x12-inch mesh-backed): 5-10% waste since small tiles fill irregular spaces easily. Natural stone tile: 15-20% waste due to more breakage during cutting. Large-format tiles (12x24 or larger): 15-25% waste due to complex cuts around outlets and corners.' },
        { heading: 'Material Price Ranges', text: 'Ceramic subway tile: $3-8 per square foot. Porcelain tile: $5-15/sq ft. Glass mosaic tile: $10-30/sq ft. Natural stone (marble, travertine): $10-40/sq ft. Peel-and-stick backsplash panels: $5-15/sq ft. Materials for a typical 30-sq-ft kitchen backsplash range from $90-240 (ceramic) to $300-900 (glass) to $300-1,200 (stone) plus thinset, grout, sealers, and trim pieces that add 20-30% more.' },
      ],
    },
    {
      title: 'How the Backsplash Calculator Works',
      content: 'This calculator determines the total square footage of backsplash area, accounting for windows, outlets, and other obstructions. It calculates tile quantities with appropriate waste factors and provides cost estimates based on material selection.',
      subsections: [
        { heading: 'Area Calculation', text: 'Measure the total wall area between countertop and upper cabinets (or ceiling). For a 10-foot wall with 18-inch backsplash height: 120 × 18 = 2,160 sq in / 144 = 15 sq ft. Subtract windows: a 36-inch wide window at standard height with 4-inch backsplash below: 36 × 4 = 144 sq in = -1 sq ft. Subtract outlets (standard 2x4-inch plate): 32 sq in each = -0.22 sq ft. Net area = 15 - 1 - (4 outlets × 0.22) = 13.12 sq ft. Add 10-15% waste: 14.5-15 sq ft to order.' },
        { heading: 'Pattern and Layout Optimization', text: 'Running bond (offset brick pattern) uses tiles staggered by 50% — the most common and waste-efficient pattern. For 3x6 subway tile over 15 sq ft net area: each tile covers 0.125 sq ft. Minimum tiles needed = 15 / 0.125 = 120 tiles. With 10% waste = 132 tiles = 11 square feet of tile (each box covers 10 sq ft typically: 1.5 boxes). Herringbone at 45 degrees increases waste to 20% = 144 tiles = 15 sq ft = 2 boxes.' },
        { heading: 'Trim and Edge Pieces', text: 'Backsplash requires trim pieces at exposed edges: standard bullnose for outside corners, quarter-round for inside corners, and Schluter edging for termination points (where tile meets painted wall). A 10-foot section needs 10 feet of edge trim. Bullnose tile: $3-8 per linear foot. Metal edging (Schluter): $5-15 per 8-foot length. For a standard backsplash: 15-20 linear feet of edging = $60-200 additional material cost.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A homeowner is tiling a backsplash in a kitchen with 35 linear feet of countertop space (L-shaped plus island), 18-inch standard height backsplash, eight outlets, and a 48-inch window over the sink.',
      subsections: [
        { heading: 'Area and Material Calculation', text: 'Total wall length: 35 ft = 420 inches. Gross area: 420 × 18 = 7,560 sq in / 144 = 52.5 sq ft. Subtractions: window (48 × 4 = 192 sq in), 8 outlets (8 × 32 = 256 sq in), 1 light switch (16 sq in). Net area = (7,560 - 192 - 256 - 16) / 144 = 4,908 / 144 = 34.08 sq ft. With 15% waste (3x6 subway in running bond): 34.08 × 1.15 = 39.2 sq ft. Order 40 sq ft = 2 cases of 20 sq ft each.' },
        { heading: 'Tile Selection and Cost', text: 'Choosing 3x6 ceramic subway tile ($5/sq ft matte white): 40 sq ft × $5 = $200. Schluter edge trim (25 linear feet for all exposed edges end/front of island): 3 lengths × $10 = $30. Thinset mortar (2 bags at $25 each): $50. Unsanded grout (2 boxes at $15 each): $30. Tile spacers, sponge, and tools: $30. Total material: $340. If using glass subway tile at $18/sq ft: 40 × $18 = $720 + $60 trim + $80 thinset/grout = $860.' },
        { heading: 'Installation Considerations', text: 'Cutting around 8 outlets requires precise measurements — use a tile bit with a template or mark and cut with a wet saw for clean results. The 48-inch window area requires L-shaped cuts on each side. Schedule: 1 day for layout and tile installation (two-person crew), 1 day for grouting and cleanup. Professional installation: $8-15/sq ft = $320-600 for this backsplash. DIY saves labor but requires $100-200 in tool rental (wet saw, tile cutter, nibbler).' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Tile installation professionals recommend these techniques for backsplash projects that look professional and last for decades.',
      subsections: [
        { heading: 'Plan Your Layout Before Starting', text: 'Dry-lay tiles on the countertop to plan the pattern, especially matching cuts at corners and around windows. Center the layout on the sink or stove — the two focal points of the kitchen. Avoid narrow slivers of tile at edges by adjusting the starting point. A 1/4-inch tile sliver at the end of a wall looks unprofessional — instead, shift the starting point so both ends have tiles at least half-width.' },
        { heading: 'Use Leveling Systems for Large Tiles', text: 'For tiles larger than 8x8 inches or rectified tiles (precision-cut edges), use a tile leveling system (TLS) with clips and wedges. These prevent lippage (uneven tile edges) that creates shadows and tripping hazards. For subway tile up to 4x12, a leveling system is optional but recommended for DIY installers. Cost: $30-60 for a kit covering 200-300 square feet.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about backsplash measurement, materials, and installation from DIY homeowners.',
      subsections: [
        { heading: 'Should I remove the old backsplash or tile over it?', text: 'Removing old backsplash is generally recommended for proper adhesion. Tiling over existing tile adds weight and reduces cabinet clearance. If the old surface is flat, clean, and well-bonded, you can tile over it using a bonding agent (primer). However, removing the old layer is safer — a failed bond on top of old tile means the entire backsplash delaminates.' },
        { heading: 'How do I handle backsplash edges near cabinets?', text: 'At wall cabinets, the backsplash meets the cabinet bottom — no edge treatment needed (tile ends under the cabinet shadow). At open ends (where backsplash meets a painted wall), use metal Schluter edging or bullnose tile. At outside corners (like a peninsula), use bullnose on both sides or a corner trim piece designed for your tile. Never leave raw tile edges exposed — they look unfinished and collect dirt.' },
      ],
    },
  ],

  'baseboard-calculator': [
    {
      title: 'What Is Baseboard Measurement and Why Does It Matter?',
      content: 'Baseboard measurement calculates the linear footage of trim needed to finish a room\'s perimeter at the junction of walls and floors. Accurate measurements prevent material shortages that delay finishing work and over-ordering that wastes 15-30% of trim budget. Proper planning accounts for corners, door frames, and irregular wall segments to ensure seamless installation with minimal joints.',
      subsections: [
        { heading: 'Understanding Linear Footage', text: 'Baseboard is sold by the linear foot. A 10x12-foot room with 44 feet of wall perimeter (10 + 10 + 12 + 12) requires 44 linear feet of baseboard — but this is the gross measurement. Net footage subtracts door openings (typically 3 feet each), leaves gaps for floor registers (4-6 inches each), and accounts for 5-10% waste for miter cuts, damaged pieces, and future repairs. A room with 44 perimeter feet and two doors: 44 - 6 (doors) = 38 feet net + 4 feet waste = 42 linear feet to order.' },
        { heading: 'Baseboard Profiles and Sizes', text: 'Common baseboard heights: 3.25 inches (colonial), 4.25 inches (ranch), 5.25 inches (craftsman), and 7.25+ inches (traditional/formal). Taller baseboards create a more substantial look and protect walls better from vacuum cleaners and mops. Material options: MDF ($0.50-1.50/ft), pine ($1-3/ft), finger-jointed pine ($0.80-2/ft), pre-primed MDF ($1-2.50/ft), hardwood oak ($2-5/ft), and PVC for bathrooms/basements ($2-4/ft).' },
        { heading: 'Inside and Outside Corners', text: 'Inside corners require coped or mitered joints. Coping (cutting the profile of one piece to fit against the face of the other) produces the best results for inside corners because it accommodates wall angles that are rarely exactly 90 degrees. Outside corners use 45-degree miter cuts — but walls are often 91-93 degrees instead of 90, requiring 46-47 degree cuts for a tight fit. Each corner type affects material quantity: miscalculated cuts waste 6-12 inches per corner.' },
      ],
    },
    {
      title: 'How the Baseboard Calculator Works',
      content: 'This calculator determines the total linear footage of baseboard needed for a room or whole house, factoring in wall lengths, door and window openings, inside and outside corners, and recommended waste percentage.',
      subsections: [
        { heading: 'Perimeter and Deduction Calculation', text: 'For a 12x14-foot room with 8-foot ceilings: perimeter = 12 + 12 + 14 + 14 = 52 feet. Deductions: one 36-inch door (3 ft), one 32-inch closet door (2.67 ft), one floor register (0.5 ft). Net linear footage = 52 - 3 - 2.67 - 0.5 = 45.83 ft. Add 10% waste for miter and cope cuts: 45.83 × 1.10 = 50.4 ft. Order 51 linear feet of baseboard. Standard stock lengths (8, 10, 12, 14, 16 ft) — order two 14-ft pieces (28 ft) and two 12-ft pieces (24 ft) = 52 ft total.' },
        { heading: 'Corner and Joint Count', text: 'The calculator counts corners to determine miter/cut waste. A rectangular room has 4 inside corners. L-shaped rooms have 6-8 inside/outside corners. Each inside corner typically uses 2-3 inches of material for cope waste; each outside corner uses 4-6 inches for miter waste. For our rectangular room: 4 corners = 24 inches (2 ft) of miter waste — included in the 10% waste factor. For rooms with many outside corners (bump-outs, bay windows), increase waste to 15-20%.' },
        { heading: 'Material Cost Estimation', text: 'For 51 linear feet using pre-primed MDF at $1.50/ft: baseboard = $76.50. Inside corner blocks (optional, $5 each): $20 for 4 corners. Caulk (2 tubes at $5): $10. Paint (1 quart at $25): $25. Nails (box of 1,000 16-gauge finish nails at $15): $15. Total for a single room: approximately $150. For the same room with oak baseboard at $3.50/ft: $178.50 + $40 for corner blocks + same accessories = $270.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A homeowner is installing 5.25-inch primed MDF baseboard throughout a 1,800-square-foot ranch home with 10 rooms, 8 closets, and 15 door openings. The home has 90-degree inside and outside corners throughout.',
      subsections: [
        { heading: 'Whole-House Measurement', text: 'Total room perimeters (all rooms measured individually): approximately 520 linear feet. Total door deductions: 15 doors at 3 ft average = 45 ft. Closet deductions: 8 closets at 2 ft average = 16 ft. Floor register deductions: 8 registers at 0.5 ft = 4 ft. Net baseboard: 520 - 45 - 16 - 4 = 455 ft. With 10% waste: 500 linear feet. In 16-foot stock lengths: 500 / 16 = 32 boards (round up from 31.25). Total stock: 32 boards × 16 ft = 512 linear feet.' },
        { heading: 'Corner and Transition Planning', text: 'The home has 24 inside corners and 12 outside corners. For a professional look, order 4-ft sections of baseboard that minimize joints on long walls — the longest walls (20 ft) get a 16-ft plus a 4-ft piece (with joint placed near a door or corner where it\'s less visible). Stagger joints on adjacent walls so they don\'t align in corners. Inside corners: cope-cut all of them for a seamless look. Outside corners: pre-cut 45-degree miters with a miter saw.' },
        { heading: 'Cost and Material Planning', text: 'Primed MDF 5.25-inch baseboard (512 linear ft at $1.80/ft): $922. Corner blocks (optional upgrade, 36 at $6 each): $216. Caulk (12 tubes at $6): $72. Paint (3 gallons at $40): $120. Nails: $25. Total: approximately $1,355. Professional installation: $2-4/linear foot = $1,000-2,000 for 500 ft. DIY installation: $200-400 in tools (miter saw rental, nailer rental, coping saw). Total DIY cost: $1,555-1,755. Professional total: $2,355-3,355.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Trim carpenters share these essential techniques for baseboard installation that looks custom and lasts a lifetime.',
      subsections: [
        { heading: 'Cope Inside Corners for a Seamless Fit', text: 'Coping — cutting the profile shape out of the end of one board so it fits tightly against the face of the adjacent board — creates a joint that stays tight even as wood expands and contracts. A coped joint never opens up like a mitered inside corner does. Use a coping saw with a 14-20 TPI blade, cutting 2-3 degrees back from the profile to create a slight undercut that ensures only the front edge touches.' },
        { heading: 'Nail Into Studs and Plates', text: 'Baseboard must be nailed into wall studs (16 or 24 inches apart) and the bottom plate. Use 16-gauge finish nails, 2 inches long for standard baseboard. Nail at 16-inch intervals plus at the top and bottom at each stud location. Set nails 1/16 inch below the surface and fill with wood putty. For MDF, pre-drill nail holes near ends to prevent splitting — MDF splits more easily than wood, especially near cut ends.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about baseboard selection, measurement, and installation for DIY and professional projects.',
      subsections: [
        { heading: 'Should baseboard match door casing?', text: 'For a cohesive look, baseboard should be the same thickness and style as door casing, but not necessarily the same height. A common combination: 3.5-inch colonial baseboard with 3.5-inch colonial casing. Mixing styles (e.g., contemporary baseboard with traditional casing) can look intentional if done throughout the house. At minimum, match the material (both MDF, both wood) and paint sheen.' },
        { heading: 'How do I handle uneven floors with baseboard?', text: 'Floors are rarely perfectly level over a 12-foot wall. Cut baseboard longer than the wall length and flex it to follow the floor contour — the gap under the baseboard should be uniform (typically 1/4-3/8 inch above hardwood for expansion, tight to the floor for carpet). For severe floor dips (over 1/4 inch), scribe the baseboard bottom to match the floor profile: run a compass along the floor with the baseboard in position, cut the scribe line, and the baseboard fits flush to the uneven floor.' },
      ],
    },
  ],

  'crown-molding-calculator': [
    {
      title: 'What Is Crown Molding Measurement and Why Does It Matter?',
      content: 'Crown molding measurement calculates the linear footage and miter angles needed to install decorative trim at the junction of walls and ceilings. Accurate planning ensures tight corner joints — the hallmark of professional trim work — and prevents the 12-18% material waste common with crown molding from miscut miters. Proper calculations transform a room from ordinary to elegant with precisely fitted crown that adds architectural character and home value.',
      subsections: [
        { heading: 'Crown Molding Profiles and Sizes', text: 'Crown molding comes in standard Spring Angles of 38 degrees (most common for residential), 45 degrees, and 52 degrees. The spring angle is the angle between the back of the molding and the wall when installed. Molding sizes range from 2.5-inch (small bathrooms, closets) to 5.5-inch (standard living areas) to 8-inch or larger (formal rooms with tall ceilings). Larger crown molding creates more dramatic shadow lines and visual ceiling height — a 6-inch crown on 9-foot ceilings adds perceived height.' },
        { heading: 'Linear Footage and Layout Planning', text: 'As with baseboard, measure each wall section at the ceiling line. For a 12x16-foot room: perimeter = 56 feet. However, crown molding does not wrap around door or window openings (it runs continuously above them), so no deductions are needed for openings. The full perimeter is the gross linear footage. Add 15-20% waste for crown molding because miter and cope cuts on crown are more complex and error-prone than baseboard. For 56 feet: 56 × 1.20 = 67.2 linear feet to order.' },
        { heading: 'Material Choices and Pricing', text: 'Common crown molding materials: MDF ($0.80-2.50/ft) — lightweight, pre-primed, and paintable; pine ($1-3/ft) — takes stain well; finger-jointed pine ($1-4/ft) — straighter than solid wood; poplar ($2-5/ft) — paints beautifully with smooth grain; polyurethane foam ($3-6/ft) — lightweight, moisture-resistant, and installs with adhesive; plaster ($8-15/ft) — highest detail but difficult to install. MDF is the most cost-effective choice for painted crown molding.' },
      ],
    },
    {
      title: 'How the Crown Molding Calculator Works',
      content: 'This calculator determines total linear footage, miter and bevel angles for cutting, and material quantities for crown molding projects. It accounts for spring angle, wall angle variations, and compound miter requirements.',
      subsections: [
        { heading: 'Length and Waste Calculation', text: 'For a 14x18-foot great room: perimeter = 64 feet. Add 20% waste (more complex cuts, longer walls require longer stock): 64 × 1.20 = 76.8 ft. Stock comes in 8, 12, and 16-foot lengths. To minimize joints, order 16-foot pieces for longest walls: the 18-foot wall requires a 16-ft piece plus a 6-ft piece (cut from a 12-ft board, leaving 6 ft for shorter walls). For 76.8 ft, order 5 pieces at 16 ft = 80 ft total. One extra board = $15-35 of insurance against mistakes.' },
        { heading: 'Miter and Bevel Angle Calculation', text: 'For 38-degree spring angle crown molding cut on a miter saw with the molding held vertically against the fence (upside down and backward): inside corner = 45.7° miter, 32.5° bevel; outside corner = 45.7° miter, 32.5° bevel (opposite direction). For 45-degree spring angle: inside miter = 35.3°, bevel = 30.0°. These compound angles require a compound miter saw (one that tilts both left and right) or a miter saw with a bevel adjustment and a crown molding jig.' },
        { heading: 'Coping vs. Mitering Inside Corners', text: 'Inside corners for crown molding are best coped (one piece runs into the corner, the other is cut to fit its profile). Coped crown joints never open up from seasonal wood expansion — mitered inside corners almost always gap after one heating season. To cope crown: cut the end square, then use a coping saw to follow the profile, undercutting 2-3 degrees. Outside corners must be mitered (both pieces cut at compound angles). A room with 4 outside corners needs 8 compound miter cuts, each with potential for error.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A homeowner is installing 4.5-inch primed MDF crown molding with 38-degree spring angle in a 14x20-foot living room with 9-foot ceilings, four outside corners (bay window bump-out), and four inside corners.',
      subsections: [
        { heading: 'Project Measurements', text: 'Main room perimeter: (14 + 20) × 2 = 68 feet. Bay window bump-out: adds 8 linear feet of wall/crown (3 ft + 2 ft + 3 ft) with four outside corners at 135 degrees each. Total perimeter: 76 feet. With 20% waste: 76 × 1.20 = 91.2 linear feet. Order 92 ft: six 16-ft pieces (96 ft) at $1.80/ft = $173 for MDF crown. The extra 4-ft piece provides backup for mistakes on the complex bay window cuts.' },
        { heading: 'Corner Cutting Plan', text: 'Four inside corners: two on the main rectangle, two where the bay window meets the main room — all coped for seamless joints. Four outside corners on the bay window: each requires compound miter cuts at 135/2 = 67.5 degrees per piece — not the standard 45. For 135° outside corners, miter angle = (135/2) - 90 = 67.5°, or more practically, set the saw to 22.5° (90 - 67.5) for each cut. The compound miter formula: miter = arctan(tan(spring angle) × cos(corner angle/2)). For 38° spring and 135° corner: miter = 14.3°, bevel = 35.0°.' },
        { heading: 'Cost and Installation Planning', text: 'Crown molding material (96 ft at $1.80/ft): $173. Corner blocks (optional, 8 at $8 each): $64. Adhesive (4 tubes at $5): $20. Nails (16-gauge, 2-inch): $15. Caulk and putty: $15. Paint (1.5 quarts at $30): $45. Total materials: $332. Professional installation: $4-8/linear foot = $350-700 for 92 ft. DIY requires compound miter saw ($150-300 rental or purchase) and coping saw ($25). DIY total with tool purchase: $500-600 — less than professional installation alone.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced crown molding installers rely on precise cutting techniques and installation methods for flawless results.',
      subsections: [
        { heading: 'Cut Crown Molding Upside Down and Backward', text: 'Place crown molding on the miter saw with the ceiling edge against the fence and the wall edge on the saw bed (upside down relative to installed position). Rotate the piece so the top (ceiling edge) is toward the operator (backward). This position allows the saw\'s bevel and miter adjustments to cut the correct compound angles without complicated math — the saw is set to the angles shown in standard crown molding charts for your spring angle.' },
        { heading: 'Use a Coping Saw for Inside Corners', text: 'Cut one piece of crown square and run it tight into the corner. For the mating piece: cut a 45° miter on the end, then use a coping saw to cut along the profile line, removing the waste behind the face. The coped piece fits over the face of the square-cut piece. Coped joints work with wall corners that are 88-93 degrees — they adapt to out-of-square walls. Practice on scrap first; coping crown is the most challenging skill in trim carpentry.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about crown molding selection, cutting, and installation for DIY homeowners and contractors.',
      subsections: [
        { heading: 'Can I install crown molding without a compound miter saw?', text: 'A compound miter saw is strongly recommended — manual miter boxes rarely achieve the precision needed for compound angles. However, you can use a coping method: cut all inside corners with coped joints (no miters needed) and cut outside corners using a miter saw with a crown molding jig (a $20-40 accessory that holds the crown at the correct spring angle). For a few outside corners, a standard miter saw with a jig works acceptably.' },
        { heading: 'How do I match crown molding to existing trim?', text: 'Crown molding should visually complement baseboard and casing but doesn\'t need to match exactly. The rule of thumb: crown molding should be approximately 10-15% narrower than the ceiling height. For 8-foot ceilings: 3-5 inch crown. For 9-foot ceilings: 4-6 inch. For 10+ foot ceilings: 5-8 inch crown. Match the style (traditional houses use detailed profiles, modern homes use clean lines) and paint sheen (semi-gloss for trim, flat for walls).' },
      ],
    },
  ],

  'stucco-calculator': [
    {
      title: 'What Is Stucco Material Estimation and Why Does It Matter?',
      content: 'Stucco is a durable cement-based exterior finish applied in multiple coats over metal lath or masonry. Accurate stucco material estimation prevents costly shortages and excess waste that can derail a project timeline and budget.',
      subsections: [
        { heading: 'Understanding Stucco as a Wall Finish', text: 'Stucco consists of Portland cement, sand, lime, and water applied in three coats: scratch, brown, and finish. The total thickness typically reaches 7/8 inch over metal lath. Each coat requires precise material ratios to achieve proper strength, crack resistance, and weatherproofing.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A typical stucco job on a 2,000-square-foot house requires roughly 9 to 11 tons of sand and 60 to 80 bags of cement. Overestimating by even 10 percent adds hundreds in unused material costs while underestimating forces expensive mid-project reorders and color-matching headaches.' },
        { heading: 'Common Pitfalls in Stucco Estimation', text: 'Many DIYers forget to account for waste factors of 5 to 10 percent, the extra material needed for corners and trim details, or the difference in coverage rates between one-coat and three-coat systems. These oversights can lead to 15 to 25 percent material errors.' },
      ],
    },
    {
      title: 'How the Stucco Calculator Works',
      content: 'The stucco calculator takes wall dimensions and stucco system type to compute exact quantities of cement, sand, lime, and lath needed for the complete job.',
      subsections: [
        { heading: 'The Core Calculation Method', text: 'For a three-coat system over lath, the calculator multiplies wall area by 0.075 cubic feet per square foot to get total stucco volume. A 1,500-square-foot wall requires 112.5 cubic feet of stucco mix, which breaks down to roughly 47 bags of cement and 5.5 tons of sand.' },
        { heading: 'Input Parameters Explained', text: 'Key inputs include wall length and height in feet, number of openings (doors and windows) that subtract from total area, stucco system type (one-coat, three-coat, or synthetic), and waste factor percentage typically set between 5 and 10 percent.' },
        { heading: 'Accessory and Lath Estimation', text: 'The calculator also estimates metal lath at 1.1 times wall area to account for overlaps, corner beads for each outside corner, and weep screed along the bottom edge. A 50-foot wall needs roughly 50 linear feet of weep screed plus corner beads for each vertical corner.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 2,400-square-foot ranch home with 12 windows and 2 doors provides a practical scenario for stucco estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'The home has exterior walls totaling 160 linear feet with an 8-foot wall height, yielding 1,280 square feet of gross wall area. Subtracting 180 square feet for openings leaves 1,100 square feet of net stucco area for a three-coat system over metal lath.' },
        { heading: 'Results and Interpretation', text: 'For 1,100 square feet, the calculator recommends 83 cubic feet of stucco mix, requiring 35 bags of Portland cement, 4.2 tons of sand, and 275 square feet of expanded metal lath. Corner beads span 28 linear feet for 7 outside corners.' },
        { heading: 'Cost and Material Planning', text: 'Material costs total approximately $1,850 for cement, sand, lath, and accessories. Ordering in whole units means 36 bags of cement, 5 tons of sand, and 300 square feet of lath — leaving a reasonable surplus for repairs and touch-ups.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced plasterers follow specific techniques to ensure accurate ordering and high-quality stucco application.',
      subsections: [
        { heading: 'Account for Mixing and Application Loss', text: 'Add 8 to 12 percent waste for mixing, application, and cleanup. On a 1,500-square-foot job, that means ordering an extra 100 to 150 square feet of materials. Professional crews round up to the nearest pallet or bulk order increment.' },
        { heading: 'Consider Climate and Curing Conditions', text: 'Hot, dry weather accelerates stucco drying and may require additional water for mixing and curing. Cool, humid conditions slow curing and may affect coverage rates. Adjust your material estimates by 5 percent based on seasonal conditions.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about stucco estimation and application.',
      subsections: [
        { heading: 'How much stucco do I need per square foot?', text: 'A three-coat system requires roughly 0.075 cubic feet of stucco mix per square foot of wall area. One-coat systems use about 0.045 cubic feet per square foot. These values include the full thickness of all coats.' },
        { heading: 'Should I buy pre-mixed or field-mixed stucco?', text: 'Pre-mixed stucco costs more per bag but ensures consistent ratios and saves labor time. Field mixing reduces material costs by 15 to 25 percent but requires skilled labor to maintain proper proportions. For projects over 1,000 square feet, field mixing is more economical.' },
      ],
    },
  ],

  'plaster-calculator': [
    {
      title: 'What Is Plaster Material Estimation and Why Does It Matter?',
      content: 'Plaster is a versatile interior wall and ceiling finish applied in one to three coats over lath or masonry surfaces. Accurate plaster estimation ensures you order the right amount of gypsum plaster, lime, sand, and water for a smooth, crack-free application.',
      subsections: [
        { heading: 'Understanding Plaster Types and Applications', text: 'Interior plaster typically uses gypsum-based or lime-based formulations applied in two or three coats. Gypsum plaster sets faster and is more common in modern construction while lime plaster offers greater breathability for historic buildings. Each type has different coverage rates and mixing ratios.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A typical 12-by-14-foot bedroom with 8-foot ceilings requires about 800 square feet of plaster surface. Ordering too little means rushed reorders and potential color or texture mismatches while ordering too much wastes 15 to 20 percent of material budget on unused supplies.' },
        { heading: 'Factors That Affect Plaster Coverage', text: 'Coverage depends on substrate type (masonry, metal lath, or blue board), number of coats, plaster thickness per coat, and surface texture. A smooth finish on blue board uses less material than a textured finish on metal lath, which can require 25 percent more plaster.' },
      ],
    },
    {
      title: 'How the Plaster Calculator Works',
      content: 'The plaster calculator takes room dimensions, plaster type, and number of coats to compute material quantities in bags and cubic feet.',
      subsections: [
        { heading: 'The Volume-Based Calculation', text: 'Total plaster volume equals surface area multiplied by coat thickness. A two-coat system at 1/4 inch per coat on 1,000 square feet requires 500 square inches of volume or roughly 41.7 cubic feet. Gypsum plaster at 1.8 pounds per square foot per coat translates to 1,800 pounds of material.' },
        { heading: 'Input Parameters Explained', text: 'Room dimensions (length, width, height) calculate wall and ceiling area. Number of doors and windows subtracts from total. Plaster type selection adjusts coverage rates: gypsum plaster covers about 50 square feet per 50-pound bag at 1/8-inch thickness while lime plaster covers roughly 35 square feet per bag.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 2,000-square-foot home renovation requiring new plaster on all interior walls and ceilings demonstrates practical calculator use.',
      subsections: [
        { heading: 'Project Scenario', text: 'The home has 8 rooms with combined wall area of 4,800 square feet and ceiling area of 2,000 square feet, totaling 6,800 square feet of plaster surface. The contractor uses a three-coat gypsum system at 3/8-inch total thickness with standard smooth finish.' },
        { heading: 'Results and Interpretation', text: 'The calculator recommends 255 bags of gypsum plaster (12,750 pounds), 340 pounds of lime, and 3.4 tons of sand for the base coats. Total material volume is 213 cubic feet. Adding 10 percent waste brings the order to 280 bags of gypsum plaster.' },
        { heading: 'Cost and Material Planning', text: 'At current prices, the plaster materials cost approximately $3,650. Ordering by the pallet (42 bags per pallet) requires 7 pallets. The contractor schedules delivery in two phases: 5 pallets for base coats and 2 pallets for the finish coat to prevent material from setting up on-site.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Seasoned plasterers rely on specific techniques to maximize material efficiency and achieve professional results.',
      subsections: [
        { heading: 'Never Skimp on the Scratch Coat', text: 'The scratch coat provides the mechanical bond for subsequent layers. Using insufficient material here causes delamination and cracking. Apply a full 3/8-inch thickness even if calculations suggest less. This coat consumes roughly 40 percent of total plaster volume.' },
        { heading: 'Factor in Mixing Water and Shrinkage', text: 'Dry plaster powder typically requires 35 to 45 percent water by weight. This water evaporates during curing, reducing final volume by 15 to 20 percent. Account for this shrinkage by adding 20 percent to your calculated plaster quantity.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about plaster estimation and application.',
      subsections: [
        { heading: 'How many square feet does a bag of plaster cover?', text: 'A 50-pound bag of gypsum plaster covers approximately 50 square feet at 1/8-inch thickness, 25 square feet at 1/4-inch, or 17 square feet at 3/8-inch. Coverage varies by brand and substrate absorption, so always check the manufacturer\'s data sheet.' },
        { heading: 'Can I plaster over existing drywall?', text: 'Yes, but the drywall must be properly prepared with a bonding agent. Existing painted surfaces require mechanical scarification or a chemical bonding agent. Plaster over drywall typically uses a thinner application of 1/8 to 3/16 inch, reducing material needs by about 40 percent.' },
      ],
    },
  ],

  'asphalt-calculator': [
    {
      title: 'What Is Asphalt Quantity Estimation and Why Does It Matter?',
      content: 'Asphalt pavement consists of a mix of aggregate and bitumen binder applied in compacted layers for driveways, parking lots, and roads. Accurate asphalt quantity estimation prevents budget overruns and ensures sufficient material for proper compaction and thickness.',
      subsections: [
        { heading: 'Understanding Asphalt Pavement', text: 'Hot mix asphalt (HMA) is the most common paving material, consisting of 95 percent stone, sand, and gravel bound together by 5 percent asphalt cement. It is applied at temperatures of 300 to 350 degrees Fahrenheit and compacted to achieve 92 to 96 percent density.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'Asphalt is typically sold by the ton, and a typical driveway requires 3 to 5 tons. Over-ordering by even 1 ton adds $100 to $150 in wasted material. Under-ordering leaves an incomplete surface with a cold joint that weakens the pavement structure.' },
        { heading: 'The Importance of Compaction Factors', text: 'Loose asphalt compacts by 15 to 25 percent during rolling. A 4-inch compacted thickness requires 4.75 to 5 inches of loose material. Failing to account for this compaction factor is the most common estimation error, leading to thin pavement that fails prematurely.' },
      ],
    },
    {
      title: 'How the Asphalt Calculator Works',
      content: 'The asphalt calculator computes tonnage based on area, compacted thickness, and asphalt density, accounting for compaction and waste.',
      subsections: [
        { heading: 'The Core Formula', text: 'Tonnage equals (length times width times compacted depth in feet times 145 pounds per cubic foot) divided by 2,000 pounds per ton. A 20-by-40-foot driveway at 4 inches thick requires (20 x 40 x 0.333 x 145) / 2,000 = 19.3 tons. Adding 5 percent waste yields 20.3 tons.' },
        { heading: 'Input Parameters Explained', text: 'Key inputs include length and width of the paved area in feet, compacted thickness (typically 2 to 6 inches for residential driveways and 6 to 12 inches for commercial parking lots), and waste factor ranging from 3 to 10 percent depending on project complexity.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A residential driveway replacement for a 2,500-square-foot property illustrates practical asphalt estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'The existing gravel driveway measures 12 feet wide by 80 feet long with a parking apron of 20 by 20 feet, totaling 1,360 square feet. The contractor specifies 4 inches of compacted asphalt over 6 inches of compacted base aggregate.' },
        { heading: 'Results and Interpretation', text: 'The calculator recommends 13.1 tons of asphalt for the 1,360-square-foot area at 4 inches thick. This requires approximately 1.3 truckloads (standard dump truck holds 10 tons). Adding 5 percent waste brings the order to 13.8 tons, rounded up to 14 tons.' },
        { heading: 'Cost and Material Planning', text: 'At $110 per ton installed, the asphalt portion costs $1,540. The base aggregate adds $680 for 17 tons of crushed stone. Total paving cost including labor and equipment runs approximately $4,200. Ordering 14 tons allows full coverage with minimal leftovers.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced paving contractors follow specific guidelines for accurate ordering and quality installation.',
      subsections: [
        { heading: 'Always Order Slightly More Than Calculated', text: 'Add 3 to 5 percent for waste and compaction uncertainty. For large parking lots, round up to the nearest half-ton. The extra material costs far less than a mid-job shortage that leaves an unprofessional cold joint.' },
        { heading: 'Account for Curb Reveals and Transitions', text: 'Driveways with edges against curbs or existing pavement require additional material for proper feathering and transitions. These edge areas consume 5 to 10 percent more asphalt per linear foot than the main paving area.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about asphalt estimation and paving.',
      subsections: [
        { heading: 'How many square feet does a ton of asphalt cover?', text: 'One ton of asphalt covers approximately 80 square feet at 2 inches thick, 40 square feet at 4 inches, or 27 square feet at 6 inches. Coverage decreases with thickness because the material volume per square foot increases.' },
        { heading: 'What is the difference between hot mix and cold patch asphalt?', text: 'Hot mix asphalt requires professional heating and compaction equipment and achieves 3 to 4 times the durability of cold patch. Cold patch is a temporary repair material that costs 40 to 60 percent more per ton but can be applied in small quantities without specialized equipment.' },
      ],
    },
  ],

  'gravel-driveway-calculator': [
    {
      title: 'What Is Gravel Driveway Estimation and Why Does It Matter?',
      content: 'A gravel driveway requires multiple layers of crushed stone compacted to provide a stable, well-draining surface. Accurate gravel estimation ensures you order the correct amount of base stone, middle layer, and top coat for a durable driveway that sheds water and resists rutting.',
      subsections: [
        { heading: 'Understanding Gravel Driveway Construction', text: 'A proper gravel driveway consists of three layers: a 6- to 8-inch base of large crushed stone (3- to 4-inch diameter), a 4-inch middle layer of 1.5-inch crushed stone, and a 2-inch top layer of 3/4-inch gravel or crushed stone with fines. Each layer serves a distinct structural purpose.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A 200-foot gravel driveway requires 30 to 50 tons of stone across all layers. Ordering 5 tons too little leaves the driveway incomplete while ordering 10 tons too much wastes $200 to $400. More importantly, incorrect layer proportions lead to settling, mud, and potholes.' },
        { heading: 'Compaction and Settling Factors', text: 'Loose gravel compacts by 10 to 15 percent after rolling and natural settling. A 12-inch total loose depth compacts to about 10.5 inches. Adding a 10 percent compaction factor to your calculation ensures the finished driveway meets the required thickness after settling.' },
      ],
    },
    {
      title: 'How the Gravel Driveway Calculator Works',
      content: 'The gravel driveway calculator computes tonnage for each layer based on length, width, depth, and stone density per layer type.',
      subsections: [
        { heading: 'The Layer-Based Calculation', text: 'Each layer\'s tonnage equals length times width times depth in feet times the stone density. Base layer at 6 inches: (200 x 12 x 0.5 x 110) / 2,000 = 66 tons of 4-inch stone. Middle layer at 4 inches: 44 tons. Top layer at 2 inches: 22 tons. Total: approximately 132 tons for a 200-foot driveway.' },
        { heading: 'Input Parameters Explained', text: 'Length and width of the driveway in feet, depth for each of the three layers (base, middle, top), stone type selection (density ranges from 100 to 135 pounds per cubic foot depending on stone size and type), and waste factor typically 5 to 10 percent.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 150-foot rural driveway replacement demonstrates practical gravel estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'The driveway is 12 feet wide with a 30-foot-wide turnaround at the house end, totaling 2,100 square feet. The contractor specifies 8 inches of base stone, 4 inches of middle stone, and 3 inches of top gravel with a 10 percent compaction factor applied to each layer.' },
        { heading: 'Results and Interpretation', text: 'Total material required: 77 tons of 4-inch base stone, 51 tons of 1.5-inch middle stone, and 38 tons of 3/4-inch top gravel. With compaction factored in, the order quantities are 85, 56, and 42 tons respectively for a grand total of 183 tons.' },
        { heading: 'Cost and Material Planning', text: 'At $25 to $35 per ton delivered, material costs range from $4,575 to $6,405. A standard dump truck carries 18 tons, requiring 10 to 11 truckloads. Scheduling delivery in layers over 2 to 3 days prevents the base from being disturbed by the middle layer delivery trucks.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced driveway contractors follow key practices for long-lasting gravel surfaces.',
      subsections: [
        { heading: 'Never Skip the Geotextile Fabric', text: 'Laying geotextile fabric between the soil and base layer prevents stone migration into the subsoil. This single step reduces gravel loss by 50 percent and extends driveway life by 5 to 10 years. The fabric adds about $0.15 per square foot to project cost.' },
        { heading: 'Grade for Proper Drainage', text: 'A gravel driveway needs a 2 to 4 percent cross-slope for water runoff and a crowned surface in straight sections. Poor drainage is the leading cause of gravel driveway failure. Add 5 percent more stone for crowned sections to account for the extra volume at the center.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about gravel driveway estimation.',
      subsections: [
        { heading: 'How deep should a gravel driveway be?', text: 'Total compacted depth should be 10 to 14 inches for regular passenger vehicle use: 6 to 8 inches of base, 3 to 4 inches of middle, and 2 to 3 inches of top gravel. Lighter use can reduce to 8 inches total while heavy truck traffic requires 16 to 18 inches.' },
        { heading: 'What type of gravel is best for the top layer?', text: 'Crushed stone with fines (also called crusher run or dense grade aggregate) is ideal for the top layer. The fines bind the stones together, creating a firm surface that sheds water and resists rutting. Pea gravel and rounded river rock should be avoided for driveways as they shift under traffic.' },
      ],
    },
  ],

  'sand-calculator': [
    {
      title: 'What Is Sand Quantity Estimation and Why Does It Matter?',
      content: 'Sand is a fundamental construction material used in concrete, mortar, leveling, and backfill applications. Accurate sand estimation ensures you purchase the right cubic yards or tons for your project without costly shortages or excess material that is difficult to store or return.',
      subsections: [
        { heading: 'Understanding Sand Types and Uses', text: 'Construction sand comes in several grades including concrete sand (coarse, ASTM C33), masonry sand (fine), fill sand, and play sand. Each type has specific particle size requirements and density characteristics. Concrete sand weighs approximately 2,700 pounds per cubic yard while dry masonry sand weighs about 2,400 pounds.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A typical concrete slab for a 24-by-24-foot garage requires 4.3 cubic yards of sand for the concrete mix. Ordering a full extra yard adds $40 to $60 in unnecessary cost. More critically, having too little sand on pour day delays the concrete truck and risks cold joints in the slab.' },
        { heading: 'Moisture and Volume Variations', text: 'Sand volume changes significantly with moisture content. Damp sand can bulk up to 30 percent more volume than dry sand for the same weight. This bulking effect means a cubic yard measured loose may contain only 0.75 cubic yards of solid material when compacted.' },
      ],
    },
    {
      title: 'How the Sand Calculator Works',
      content: 'The sand calculator converts project dimensions into cubic feet, cubic yards, and tons based on sand type and compaction requirements.',
      subsections: [
        { heading: 'The Volume Conversion Formula', text: 'Sand volume in cubic yards equals length in feet times width in feet times depth in feet divided by 27. A 10-by-10-foot sandbox at 6 inches deep: (10 x 10 x 0.5) / 27 = 1.85 cubic yards. At 2,700 pounds per cubic yard for concrete sand, this equals 5,000 pounds or 2.5 tons.' },
        { heading: 'Input Parameters Explained', text: 'Project length, width, and depth in either inches or feet, sand type selection which adjusts density (play sand is lighter at 2,400 pounds per cubic yard while concrete sand is heavier at 2,700), compaction factor for fill applications typically 15 to 25 percent, and waste factor of 5 to 10 percent.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A paver patio project requiring a sand bed demonstrates practical sand estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A 16-by-20-foot paver patio needs a 1-inch sand setting bed over 6 inches of compacted gravel base. The sand bed volume: (16 x 20 x 0.0833) / 27 = 0.99 cubic yards. Adding 10 percent for screeding unevenness and waste yields 1.1 cubic yards or approximately 1.5 tons.' },
        { heading: 'Results and Interpretation', text: 'The calculator recommends 1.1 cubic yards of masonry sand for the setting bed. This fills 33 standard 50-pound bags (each covering roughly 1/30 of a cubic yard) or one bulk delivery of 1.5 tons. Masonry sand is specified for its fine, consistent texture that allows smooth paver leveling.' },
        { heading: 'Cost and Material Planning', text: 'Bulk sand costs $15 to $25 per ton delivered, so the 1.5-ton order runs $23 to $38. Bagged masonry sand costs significantly more at $4 to $6 per 50-pound bag, totaling $132 to $198 for 33 bags. For projects over 0.5 cubic yards, bulk delivery is substantially cheaper.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Contractors rely on specific techniques for accurate sand ordering and efficient use.',
      subsections: [
        { heading: 'Order by Weight, Not Volume', text: 'Sand is sold by the ton, not the cubic yard, because volume varies with moisture. Always convert your cubic yard calculation to tons using the specific density for your sand type. This avoids the bulking trap where damp sand appears to meet your volume but actually falls short by weight.' },
        { heading: 'Account for Tamping and Compaction', text: 'Sand used as a base or backfill material compacts by 15 to 25 percent. For paver base sand, order 20 percent more than the calculated void volume. For concrete sand, the concrete mix design already accounts for aggregate volume, so no additional compaction factor is needed.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about sand estimation and purchasing.',
      subsections: [
        { heading: 'How many 50-pound bags of sand equal a cubic yard?', text: 'Approximately 54 bags of dry masonry sand (50 pounds each) equal 1 cubic yard. For concrete sand, which is heavier, roughly 48 bags per cubic yard. This varies with moisture content, so bulk purchasing is more accurate for large projects.' },
        { heading: 'Can I mix sand types for different applications?', text: 'Sand types should not be substituted without consulting project specifications. Concrete sand has specific particle gradation required for structural concrete. Using masonry sand in concrete reduces compressive strength by 10 to 20 percent because fine particles require more cement paste to coat.' },
      ],
    },
  ],

  'topsoil-calculator': [
    {
      title: 'What Is Topsoil Volume Estimation and Why Does It Matter?',
      content: 'Topsoil is the nutrient-rich upper layer of soil used for gardens, lawns, and landscaping projects. Accurate topsoil estimation ensures you order the right volume for healthy plant growth while avoiding unnecessary expense and the hassle of disposing of excess material.',
      subsections: [
        { heading: 'Understanding Topsoil Quality and Depth', text: 'Quality topsoil contains 2 to 5 percent organic matter, balanced loam texture (roughly 40 percent sand, 40 percent silt, 20 percent clay), and a pH between 6.0 and 7.0. The required depth varies by use: 4 to 6 inches for lawns, 8 to 12 inches for vegetable gardens, and 12 to 18 inches for trees and shrubs.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A 500-square-foot garden bed at 12 inches deep requires 18.5 cubic yards of topsoil. At $30 to $50 per cubic yard delivered, over-ordering by 5 cubic yards wastes $150 to $250. Under-ordering leaves plants with insufficient root depth, stunting growth and reducing yields.' },
        { heading: 'Settling and Decomposition Factors', text: 'Fresh topsoil settles by 15 to 25 percent after watering and natural decomposition of organic matter. A 12-inch installed depth settles to 9 to 10 inches over several months. Accounting for this settling at the time of ordering ensures adequate long-term depth for root development.' },
      ],
    },
    {
      title: 'How the Topsoil Calculator Works',
      content: 'The topsoil calculator computes cubic yards needed based on area dimensions, desired depth, settling factor, and soil type.',
      subsections: [
        { heading: 'The Volume Calculation Method', text: 'Cubic yards equals area in square feet times depth in feet divided by 27. A 40-by-30-foot lawn (1,200 square feet) at 6 inches deep: (1,200 x 0.5) / 27 = 22.2 cubic yards. Adding a 20 percent settling factor brings the order to 26.6 cubic yards.' },
        { heading: 'Input Parameters Explained', text: 'Length and width of the area in feet or total square footage, desired settled depth in inches, settling factor (typically 15 to 25 percent depending on organic content), soil quality grade (premium with high organic matter settles more than basic fill), and waste factor for spreading unevenness.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Creating a new vegetable garden and lawn area demonstrates practical topsoil estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A homeowner is converting 2,000 square feet of existing poor soil into a landscaped area: 400 square feet for raised vegetable beds at 12 inches deep and 1,600 square feet for lawn at 6 inches deep. A 20 percent settling factor is applied for the garden and 15 percent for the lawn.' },
        { heading: 'Results and Interpretation', text: 'Garden beds: (400 x 1.0) / 27 = 14.8 cubic yards plus 20 percent settling = 17.8 cubic yards. Lawn area: (1,600 x 0.5) / 27 = 29.6 cubic yards plus 15 percent settling = 34.0 cubic yards. Total topsoil order: 51.8 cubic yards or about 52 cubic yards delivered.' },
        { heading: 'Cost and Material Planning', text: 'At $40 per cubic yard for premium screened topsoil, delivered material costs $2,080. A standard dump truck carries 12 to 14 cubic yards, requiring 4 truckloads. Spreading 52 cubic yards by hand is labor-intensive; a skid-steer rental for $300 per day saves significant labor time.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Landscaping professionals follow specific guidelines for topsoil ordering and installation.',
      subsections: [
        { heading: 'Always Test Existing Soil First', text: 'Before ordering topsoil, test your existing soil pH and texture. If existing soil is already good loam, you may need only 2 to 4 inches of topsoil rather than 6 to 8 inches. A $15 soil test can save hundreds in unnecessary topsoil purchases.' },
        { heading: 'Order Screened Topsoil for Consistent Results', text: 'Unscreened topsoil contains rocks, roots, and debris that can account for 15 to 30 percent of volume. Screened topsoil with a 1/2-inch mesh costs 20 to 30 percent more but provides consistent texture, accurate volume, and eliminates the labor of removing debris from garden beds.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about topsoil estimation and gardening.',
      subsections: [
        { heading: 'How many cubic yards of topsoil do I need for a 1,000-square-foot lawn?', text: 'For a 1,000-square-foot lawn area at 6 inches deep, you need approximately 18.5 cubic yards before settling. Adding a 15 percent settling factor brings the total to 21.3 cubic yards. At 4 inches deep, the amount drops to 12.3 cubic yards before settling.' },
        { heading: 'Is all topsoil the same quality?', text: 'No, topsoil quality varies dramatically by source. Look for topsoil with 2 to 5 percent organic matter, dark brown color, crumbly texture, and no strong odor. Avoid topsoil with visible debris, clay clods, or a sour smell. Premium topsoil costs $10 to $20 more per cubic yard but provides significantly better plant growth.' },
      ],
    },
  ],

  'compost-calculator': [
    {
      title: 'What Is Compost Volume Estimation and Why Does It Matter?',
      content: 'Compost is decomposed organic matter used to improve soil structure, water retention, and nutrient content in gardens and landscapes. Accurate compost estimation ensures you apply the right amount to enrich soil without over-application that can harm plants and waste money.',
      subsections: [
        { heading: 'Understanding Compost Types and Benefits', text: 'Compost comes in various forms including garden compost, mushroom compost, leaf mold, and vermicompost. Each provides different nutrient profiles: garden compost offers balanced NPK ratios around 1-1-1 while mushroom compost has higher calcium. Compost improves sandy soil water retention by up to 50 percent and clay soil drainage significantly.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'Applying 3 inches of compost to a 1,000-square-foot garden requires 9.3 cubic yards. At $35 to $60 per cubic yard, over-ordering by 3 cubic yards wastes $105 to $180. Under-ordering leaves soil inadequately amended, requiring supplemental applications that disturb plant roots.' },
        { heading: 'The Importance of Application Rates', text: 'Compost application rates vary by purpose: 1/4 to 1/2 inch as a top dressing for lawns, 1 to 2 inches incorporated into existing garden beds, and 3 to 4 inches for new garden establishment. Excessive compost can lead to nutrient runoff, excessive phosphorus, and impaired plant growth.' },
      ],
    },
    {
      title: 'How the Compost Calculator Works',
      content: 'The compost calculator determines cubic yards needed based on area, desired depth, and application type with adjustments for compost maturity and density.',
      subsections: [
        { heading: 'The Area-Depth Formula', text: 'Cubic yards equals square footage times depth in inches divided by 324 (since 1 cubic yard at 1 inch depth covers 324 square feet). A 40-by-50-foot lawn (2,000 square feet) at 1/2 inch: 2,000 x 0.5 / 324 = 3.1 cubic yards. For a garden at 2 inches: 2,000 x 2 / 324 = 12.3 cubic yards.' },
        { heading: 'Input Parameters Explained', text: 'Area length and width or total square feet, application depth in inches (typical range 0.25 to 4 inches), compost type (mature compost is denser at 800 to 1,000 pounds per cubic yard while coarse compost is lighter at 600 to 800 pounds), and coverage method (top dressing vs. incorporation affects required volume).' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Amending a community vegetable garden demonstrates practical compost estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'The community garden has 20 raised beds each 4 by 8 feet (640 square feet total) needing 2 inches of compost incorporation plus a 1,500-square-foot lawn needing 1/2 inch top dressing. The gardener specifies mature garden compost at 900 pounds per cubic yard.' },
        { heading: 'Results and Interpretation', text: 'Raised beds: 640 x 2 / 324 = 3.95 cubic yards. Lawn: 1,500 x 0.5 / 324 = 2.31 cubic yards. Total: 6.26 cubic yards or approximately 6.3 cubic yards. At 900 pounds per cubic yard, this weighs 5,670 pounds or 2.8 tons.' },
        { heading: 'Cost and Material Planning', text: 'Bulk compost at $45 per cubic yard totals $284 delivered. Bagged compost at $3 per 1-cubic-foot bag would cost $507 for 169 bags, making bulk the clear winner. The garden club schedules delivery one week before planting to allow the compost to settle and integrate with existing soil.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Master gardeners and landscapers follow specific protocols for compost application.',
      subsections: [
        { heading: 'Match Compost Maturity to Application', text: 'Mature compost (6 to 12 months old) is dark, crumbly, and odorless — ideal for seed starting and incorporating into garden beds. Fresh compost (2 to 4 months) can contain high ammonia levels and organic acids that damage plant roots. Use fresh compost only for top dressing established plants.' },
        { heading: 'Apply Compost at the Right Time', text: 'Apply compost 2 to 4 weeks before planting for spring gardens to allow nutrients to stabilize in the soil. Fall application is ideal for heavy clay soils because winter freeze-thaw cycles help incorporate the organic matter. Avoid applying compost to frozen ground as it will wash away in spring thaw.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about compost estimation and soil amendment.',
      subsections: [
        { heading: 'How much compost do I need for a 100-square-foot garden?', text: 'At 2 inches deep: 100 x 2 / 324 = 0.62 cubic yards or 16.7 cubic feet. This equals roughly 17 bags of bagged compost (1 cubic foot each) or 1/2 cubic yard in bulk. At 4 inches deep for new beds: 1.23 cubic yards.' },
        { heading: 'Can I use too much compost?', text: 'Yes, excessive compost Application can harm plants. More than 3 inches incorporated into soil can create nutrient imbalances, tie up nitrogen as microorganisms decompose fresh organic matter, and create drainage problems. Stick to recommended rates of 1 to 2 inches for existing beds and 3 to 4 inches for new beds.' },
      ],
    },
  ],

  'landscaping-rock-calculator': [
    {
      title: 'What Is Landscaping Rock Estimation and Why Does It Matter?',
      content: 'Landscaping rock includes decorative stone, river rock, crushed granite, and pebbles used for ground cover, pathways, and aesthetic features. Accurate rock estimation ensures you order sufficient material for full coverage at proper depth without costly surplus that is heavy and difficult to relocate.',
      subsections: [
        { heading: 'Understanding Landscaping Rock Types', text: 'Common landscaping rocks include river rock (smooth, rounded, 1/2 to 4 inches), crushed granite (angular, 1/4 to 2 inches), pea gravel (small, rounded, 3/8 to 5/8 inch), and lava rock (lightweight, porous, 1 to 3 inches). Each type has different coverage characteristics: pea gravel covers more area per ton than river rock because of its smaller particle size and tighter packing.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A 200-square-foot garden bed with 3 inches of river rock requires approximately 1.9 tons. At $100 to $200 per ton installed, over-ordering by 0.5 ton wastes $50 to $100. Under-ordering is worse — matching color and size from a different batch is nearly impossible, leaving a visible line in your landscape.' },
        { heading: 'Depth Requirements for Proper Coverage', text: 'Landscaping rock needs sufficient depth to prevent underlying weed fabric from showing and to suppress weed growth. Minimum depths: 2 inches for small pea gravel, 3 inches for medium river rock (1 to 2 inches), and 4 inches for large decorative boulders. Lighter-colored rocks require slightly more depth for full coverage.' },
      ],
    },
    {
      title: 'How the Landscaping Rock Calculator Works',
      content: 'The calculator converts area and depth into tons based on rock type density, accounting for particle size and void space.',
      subsections: [
        { heading: 'The Volume-to-Weight Formula', text: 'Tons equals length in feet times width in feet times depth in inches divided by 12 times rock density in pounds per cubic foot divided by 2,000. A 10-by-20-foot pathway at 2 inches of pea gravel: (10 x 20 x 0.167 x 100) / 2,000 = 1.67 tons. Lava rock at 50 pounds per cubic foot would need only 0.84 tons.' },
        { heading: 'Input Parameters Explained', text: 'Area length and width in feet, coverage depth in inches, rock type selection (density varies dramatically: pea gravel at 100 to 110 pounds per cubic foot, river rock at 100 to 120, crushed granite at 110 to 130, and lava rock at only 50 to 65), and waste factor of 5 to 10 percent.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A front yard xeriscape conversion demonstrates practical landscaping rock estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A 1,500-square-foot front yard is converted from lawn to xeriscape with 800 square feet of decorative river rock, 300 square feet of crushed granite pathways, and 400 square feet of hardscape. The river rock is specified at 3 inches deep and crushed granite at 2 inches deep with a 5 percent waste factor.' },
        { heading: 'Results and Interpretation', text: 'River rock: (800 x 0.25 x 110) / 2,000 = 11.0 tons plus 5 percent waste = 11.6 tons. Crushed granite: (300 x 0.167 x 120) / 2,000 = 3.0 tons plus 5 percent = 3.2 tons. Total rock order: 14.8 tons requiring 2 dump truck deliveries.' },
        { heading: 'Cost and Material Planning', text: 'River rock at $130 per ton delivered: $1,508. Crushed granite at $110 per ton: $352. Total material cost: $1,860. A wheelbarrow moves roughly 150 pounds per trip, meaning 197 trips to distribute all the rock. Renting a mini skid-steer for $250 per day is highly recommended.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Landscape contractors follow specific guidelines for rock installation and ordering.',
      subsections: [
        { heading: 'Always Install Weed Barrier Fabric', text: 'Professional-grade woven geotextile fabric prevents weeds from growing through the rock while allowing water drainage. Skip the cheap landscape fabric that degrades in 1 to 2 years. Quality fabric adds $0.10 to $0.20 per square foot but eliminates the need for chemical weed control.' },
        { heading: 'Order Rock by Visual Coverage, Not Just Volume', text: 'Dark rocks absorb light and appear to cover less area than light-colored rocks at the same depth. For dark basalt or river rock, add 0.5 inch to the calculated depth. For light marble or limestone, the calculated depth is usually sufficient for full visual coverage.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about landscaping rock estimation and installation.',
      subsections: [
        { heading: 'How many square feet does a ton of river rock cover?', text: 'One ton of 1- to 2-inch river rock covers approximately 60 to 80 square feet at 2 inches deep, 40 to 50 square feet at 3 inches deep, and 30 to 40 square feet at 4 inches deep. Coverage varies with rock shape and density, so these are approximate values.' },
        { heading: 'What is the best rock size for pathways?', text: 'Crushed granite or decomposed granite (1/4 to 3/8 inch) is the best choice for pathways because it compacts into a firm, stable surface. Pea gravel shifts underfoot and requires edging to contain it. River rock larger than 2 inches is uncomfortable to walk on and best suited for decorative beds.' },
      ],
    },
  ],

  'paver-calculator': [
    {
      title: 'What Is Paver Estimation and Why Does It Matter?',
      content: 'Paver estimation calculates the number of paving stones, base materials, and sand needed for patios, walkways, driveways, and pool decks. Accurate estimation prevents mid-project shortages that delay construction and avoids excess pavers that cannot be returned after installation.',
      subsections: [
        { heading: 'Understanding Paver Types and Patterns', text: 'Concrete pavers come in various shapes including rectangular, square, hexagonal, and interlocking patterns. Common sizes include 4-by-8-inch, 6-by-9-inch, and 12-by-12-inch. The pattern chosen affects material count: a running bond uses more pavers per square foot than a stacked bond due to edge waste.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A 400-square-foot patio with 6-by-9-inch pavers requires approximately 1,067 pavers. Ordering 5 percent too few means 53 missing pavers, and matching color and batch from a different production run risks visible color variation. Over-ordering by 10 percent leaves 107 unused pavers that may not be returnable.' },
        { heading: 'The Complete Paver System', text: 'A proper paver installation includes multiple materials: compacted subgrade, 4 to 8 inches of base gravel, 1 inch of bedding sand, the pavers themselves, and polymeric joint sand. Each component must be estimated separately and the paver count alone is only part of the total material calculation.' },
      ],
    },
    {
      title: 'How the Paver Calculator Works',
      content: 'The calculator computes paver quantities, base material volumes, and joint sand based on project dimensions, paver size, and pattern.',
      subsections: [
        { heading: 'The Paver Count Formula', text: 'Number of pavers equals patio area in square inches divided by paver area in square inches, plus waste factor. A 20-by-20-foot patio (57,600 square inches) with 6-by-9-inch pavers (54 square inches): 57,600 / 54 = 1,067 pavers. Adding 10 percent waste for cutting and breakage = 1,174 pavers.' },
        { heading: 'Input Parameters Explained', text: 'Patio length and width in feet, paver length and width in inches, joint width (typically 1/8 to 3/8 inch affects total pavers slightly), pattern type (running bond uses 7 percent more than stacked bond due to edge cuts), base gravel depth (4 to 8 inches for patios, 8 to 12 for driveways), and waste factor (5 percent for simple rectangles, 10 to 15 percent for curves).' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A curved pool deck installation demonstrates practical paver estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A 24-by-40-foot freeform pool deck with an actual paved area of 950 square feet (accounting for curves and cutouts) using 12-by-12-inch square pavers in a stacked bond pattern with 6 inches of base gravel. The irregular shape requires a 15 percent waste factor.' },
        { heading: 'Results and Interpretation', text: 'Paver count: 950 x 144 / (12 x 12) = 950 pavers plus 15 percent waste = 1,093 pavers. Base gravel: (950 x 0.5) / 27 = 17.6 cubic yards plus 5 percent compaction = 18.5 cubic yards. Bedding sand: (950 x 0.0833) / 27 = 2.93 cubic yards.' },
        { heading: 'Cost and Material Planning', text: 'Pavers at $2.50 each: $2,733. Base gravel at $35 per yard: $648. Bedding sand at $25 per yard: $73. Polymeric joint sand for 950 square feet: $285. Total material cost approximately $3,739. Ordering extra pavers for future repairs is recommended — store 20 to 30 pavers for potential replacement.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced paver installers follow critical practices for long-lasting results.',
      subsections: [
        { heading: 'Always Order Extra Pavers for Cutting', text: 'For rectangular projects, order 10 percent extra. For circular or curved patios, order 15 to 20 percent extra. Cut pavers near the edges often get damaged during cutting with a wet saw. Having 20 to 30 extra pavers ensures you can match color for future repairs years later.' },
        { heading: 'Don\'t Forget Polymeric Joint Sand', text: 'Polymeric sand locks pavers together and prevents weed growth and ant infiltration. Standard sand washes out within 1 to 2 years. Budget for one 50-pound bag per 50 to 80 square feet of patio. For the 950-square-foot deck example, that is 12 to 19 bags at $25 each.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about paver estimation and installation.',
      subsections: [
        { heading: 'How many pavers do I need for a 10-by-10-foot patio?', text: 'For 100 square feet: 4-by-8-inch pavers need 450 units, 6-by-9-inch pavers need 267 units, and 12-by-12-inch pavers need 100 units. All plus 10 percent waste. Always include waste in your order to avoid color mismatch from a different production batch.' },
        { heading: 'What is the difference between polymeric sand and regular sand?', text: 'Polymeric sand contains polymers that activate with water, bonding the sand particles together into a firm, permeable joint that resists washout, weeds, and insects. Regular masonry sand costs 75 percent less but washes out within 1 to 2 years, requiring reapplication. Polymeric sand is required by most paver manufacturers for warranty coverage.' },
      ],
    },
  ],

  'retaining-wall-calculator': [
    {
      title: 'What Is Retaining Wall Estimation and Why Does It Matter?',
      content: 'A retaining wall holds back soil to create level areas on sloped properties, prevent erosion, and add usable yard space. Accurate retaining wall estimation calculates the number of blocks, cubic yards of base material, drainage aggregate, and geogrid reinforcement needed for a structurally sound wall.',
      subsections: [
        { heading: 'Understanding Retaining Wall Types', text: 'Retaining walls include segmental concrete block walls, interlocking modular systems, poured concrete, natural stone, and timber. Segmental block walls are most popular for residential use, with block sizes ranging from 8-by-6 inches to 18-by-12 inches. Wall height determines structural requirements: walls over 4 feet need geogrid reinforcement or engineered design.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A 60-foot-long, 3-foot-high retaining wall requires approximately 360 standard blocks, 6 tons of base aggregate, and 9 tons of drainage stone. Under-estimating base material by 1 ton can lead to wall settlement and failure within 2 to 3 years. Over-ordering blocks by 10 percent adds $200 to $500 in unnecessary cost.' },
        { heading: 'Critical Structural Components', text: 'Beyond blocks, retaining walls require: 6 to 12 inches of compacted base gravel for frost protection, 12 to 18 inches of washed drainage stone behind the wall, perforated drain pipe at the base, and geogrid reinforcement for walls over 4 feet. Each component must be precisely estimated for structural integrity.' },
      ],
    },
    {
      title: 'How the Retaining Wall Calculator Works',
      content: 'The calculator computes block count, base material, drainage aggregate, and geogrid based on wall length, height, and block type.',
      subsections: [
        { heading: 'The Block Count Formula', text: 'Number of blocks equals wall length in inches divided by block length in inches times wall height in inches divided by block height in inches. A 50-foot wall (600 inches) with 12-by-8-inch blocks at 4 feet high (48 inches): (600 / 12) x (48 / 8) = 50 x 6 = 300 blocks per course. For a 4-foot wall, full height: 300 blocks.' },
        { heading: 'Input Parameters Explained', text: 'Wall length in feet, wall height in feet (above grade plus buried base course), block dimensions (length and height in inches), cap block selection (typically same length but thinner), base gravel depth (6 to 12 inches depending on frost depth), drainage aggregate depth behind wall (12 to 18 inches), and geogrid layer spacing (every 2 feet for walls over 4 feet).' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A sloped backyard terracing project demonstrates practical retaining wall estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A homeowner needs a 75-foot-long retaining wall with an exposed height of 4.5 feet to create a level terrace. One block course is buried below grade, making total height 5 feet. Blocks are 12 by 8 inches. The wall requires geogrid reinforcement because it exceeds 4 feet.' },
        { heading: 'Results and Interpretation', text: 'Block count: (75 x 12 / 12) x (60 / 8) = 75 x 7.5 = 563 blocks. Adding 5 percent for breakage = 591 blocks. Base gravel: (75 x 2 x 0.83) / 27 = 4.6 cubic yards. Drainage stone: (75 x 1.33 x 4.5) / 27 = 16.6 cubic yards. Geogrid: 75 feet x 6 feet wide (3 layers at 2-foot spacing) = 450 square feet.' },
        { heading: 'Cost and Material Planning', text: 'Blocks at $3.50 each: $2,069. Base gravel at $40 per yard: $184. Drainage stone at $45 per yard: $747. Geogrid at $0.50 per square foot: $225. Perforated drain pipe: $120. Cap blocks: $680. Total materials: approximately $4,025. This 5-foot wall typically requires a building permit in most jurisdictions.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced retaining wall contractors follow critical structural guidelines.',
      subsections: [
        { heading: 'Never Skip the Drainage System', text: 'Poor drainage causes 90 percent of retaining wall failures. A perforated drain pipe wrapped in filter fabric at the base plus 12 to 18 inches of washed drainage stone behind the wall relieves hydrostatic pressure. Without drainage, water pressure behind a 50-foot wall can exceed 50,000 pounds during heavy rain.' },
        { heading: 'Proper Base Preparation Is Essential', text: 'The base trench must be dug to frost depth (typically 12 to 48 inches depending on climate) and filled with 6 to 12 inches of compacted 3/4-inch crushed stone. A level, well-compacted base prevents wall tilting and settlement. Wall failure within 5 years is nearly always due to inadequate base preparation.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about retaining wall estimation and construction.',
      subsections: [
        { heading: 'How high can I build a retaining wall without engineering?', text: 'Most building codes allow walls up to 4 feet in height without engineered plans. Walls above 4 feet require structural engineering, geogrid reinforcement, and permits. The height is measured from the bottom of the base course to the top of the finished wall, not just the exposed portion.' },
        { heading: 'Do I need a building permit for a retaining wall?', text: 'Permits are typically required for walls over 3 to 4 feet in height and any wall that supports a surcharge (like a driveway or structure above). Check local codes before construction. Building without a required permit can result in fines and forced removal of the wall.' },
      ],
    },
  ],

  'garden-bed-calculator': [
    {
      title: 'What Is Garden Bed Material Estimation and Why Does It Matter?',
      content: 'Garden bed estimation calculates the volume of soil, compost, and mulch needed for raised beds and in-ground garden plots. Accurate estimation ensures you fill beds to the proper depth for healthy root development while avoiding the expense and labor of handling excess material.',
      subsections: [
        { heading: 'Understanding Garden Bed Types and Configurations', text: 'Raised garden beds come in standard depths of 6, 12, 18, and 24 inches. Common configurations include 4-by-4-foot square beds, 4-by-8-foot rectangular beds, and custom shapes. The bed depth determines what can be grown: 6 inches for shallow-rooted greens, 12 inches for most vegetables, and 18-plus inches for deep-rooted crops like tomatoes and carrots.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'A single 4-by-8-foot bed at 12 inches deep requires 32 cubic feet or 1.19 cubic yards of soil. A three-bed garden needs 3.57 cubic yards. Over-ordering by 1 cubic yard wastes $35 to $55 and requires disposing of 2,000-plus pounds of excess soil, while under-ordering leaves root systems cramped.' },
        { heading: 'Soil Layering and Mix Ratios', text: 'The best raised bed soil mix follows the 40-40-20 rule: 40 percent topsoil, 40 percent compost, and 20 percent aeration amendments like perlite or vermiculite. Each component must be estimated separately. A 12-inch bed gets filled with 6 inches of topsoil, 5 inches of compost, and 1 inch of aeration material.' },
      ],
    },
    {
      title: 'How the Garden Bed Calculator Works',
      content: 'The calculator computes total soil volume and breaks it down by component based on bed dimensions and recommended mix ratios.',
      subsections: [
        { heading: 'The Volume Calculation Method', text: 'Total cubic feet equals bed length in feet times width in feet times depth in feet. A 4-by-8-foot bed at 12 inches deep: 4 x 8 x 1 = 32 cubic feet. Converting to cubic yards: 32 / 27 = 1.19 cubic yards. For the 40-40-20 mix: 0.48 cubic yards topsoil, 0.48 cubic yards compost, 0.24 cubic yards aeration material.' },
        { heading: 'Input Parameters Explained', text: 'Bed length and width in feet, bed depth in inches (6, 12, 18, or 24 typical), number of identical beds, soil mix ratio selection (standard vegetable blend, flower blend with less compost, or custom ratio), and settling factor of 10 to 15 percent for organic material that decomposes over time.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Starting a backyard vegetable garden with multiple beds shows practical estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A gardener builds three beds: two 4-by-8-foot beds at 18 inches deep for deep-rooted crops and one 4-by-4-foot bed at 12 inches deep for herbs and greens. They use the standard 40-40-20 mix with a 10 percent settling factor for the compost component.' },
        { heading: 'Results and Interpretation', text: 'Large beds: each 4 x 8 x 1.5 = 48 cubic feet each, 96 cubic feet total. Small bed: 4 x 4 x 1 = 16 cubic feet. Total volume: 112 cubic feet or 4.15 cubic yards. Mix breakdown: 1.66 yards topsoil, 1.66 yards compost (plus 10 percent = 1.83 yards), and 0.83 yards perlite or vermiculite.' },
        { heading: 'Cost and Material Planning', text: 'Topsoil at $30 per yard: $50. Compost at $45 per yard: $82. Perlite at $15 per 4-cubic-foot bag (6.7 bags): $101. Total soil cost: $233. Filling the beds two weeks before planting allows settling, after which 1 to 2 inches of additional compost may be needed to top off.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced gardeners follow specific guidelines for bed preparation and soil management.',
      subsections: [
        { heading: 'Account for Soil Settling Over Time', text: 'Fresh soil mix settles by 10 to 15 percent over the first growing season as organic matter decomposes and the soil structure stabilizes. Fill beds to 1 inch below the rim initially, then top off with compost the following spring. This maintains proper soil depth without overflowing.' },
        { heading: 'Use the Right Soil for Each Bed Type', text: 'Vegetable beds need nutrient-rich soil with 30 to 40 percent compost. Flower beds do well with 20 to 30 percent compost. Herb beds prefer leaner soil at 15 to 20 percent compost to prevent excessive leafy growth at the expense of essential oils. Adjust your mix ratios accordingly.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about garden bed estimation and soil management.',
      subsections: [
        { heading: 'How many cubic feet of soil do I need for a 4x8 raised bed?', text: 'At 6 inches deep: 16 cubic feet (0.59 cubic yards). At 12 inches deep: 32 cubic feet (1.19 cubic yards). At 18 inches deep: 48 cubic feet (1.78 cubic yards). At 24 inches deep: 64 cubic feet (2.37 cubic yards). These are before settling, so add 10 to 15 percent for organic mixes.' },
        { heading: 'Should I put gravel at the bottom of raised beds?', text: 'No, gravel at the bottom of raised beds can create a perched water table that keeps roots too wet. Instead, lay cardboard directly on the grass or weeds to smother them, then fill with soil directly. The cardboard decomposes in 6 to 12 months while allowing drainage.' },
      ],
    },
  ],

  'sod-calculator': [
    {
      title: 'What Is Sod Quantity Estimation and Why Does It Matter?',
      content: 'Sod is pre-grown grass rolled into strips for instant lawn installation. Accurate sod estimation ensures you order the right number of square feet to cover your lawn area without costly over-ordering of perishable turf or the disappointment of visible seams from under-ordering.',
      subsections: [
        { heading: 'Understanding Sod Types and Specifications', text: 'Common sod varieties include Kentucky bluegrass, tall fescue, Bermuda grass, zoysia, and St. Augustine. Each has different sun, water, and maintenance requirements. A standard sod pallet covers 400 to 500 square feet and weighs 1,500 to 2,000 pounds. Individual sod pieces are typically 16 by 24 inches or 18 by 24 inches.' },
        { heading: 'Why Accurate Estimation Is Critical', text: 'Sod is a perishable product that must be installed within 24 to 48 hours of harvest. A typical 5,000-square-foot lawn needs 10 to 12 pallets. Over-ordering by one pallet ($200 to $400) means the excess sod dies before it can be used. Under-ordering by 500 square feet leaves bare soil that erodes while waiting for more sod.' },
        { heading: 'The Cost of Inaccurate Measurement', text: 'Every 1 percent measurement error on a 5,000-square-foot lawn results in 50 square feet of incorrect sod. At $0.35 to $0.60 per square foot installed, a 5 percent error costs $88 to $150. More importantly, splicing in additional sod 2 to 3 days later creates visible seam lines that take a full growing season to blend.' },
      ],
    },
    {
      title: 'How the Sod Calculator Works',
      content: 'The sod calculator computes total square footage of sod needed based on lawn area shape, subtracting non-turf features and adding waste factors for irregular edges.',
      subsections: [
        { heading: 'The Area Calculation Method', text: 'For rectangular lawns: length times width equals square footage. For irregular shapes, the calculator breaks the area into rectangles, triangles, and circles. A 50-by-100-foot lawn with a 200-square-foot garden bed in the middle: 5,000 minus 200 = 4,800 square feet plus 5 percent waste = 5,040 square feet.' },
        { heading: 'Input Parameters Explained', text: 'Lawn dimensions or total square footage, shape complexity (simple rectangle adds 5 percent waste, irregular curves add 10 to 15 percent), areas to exclude (garden beds, pathways, trees), sod type (which affects roll dimensions and coverage per pallet), and installation pattern (running bond stagger uses 3 percent more than straight rows).' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Installing a new lawn on a standard residential lot demonstrates practical sod estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A 0.25-acre lot has 8,500 square feet of lawn area after accounting for the house, driveway, and landscaping beds. The yard has curved edges along flower beds and a 10-by-20-foot vegetable garden that is excluded. The homeowner chooses tall fescue sod on pallets covering 450 square feet each. With curves, a 12 percent waste factor applies.' },
        { heading: 'Results and Interpretation', text: 'Net lawn area: 8,500 square feet plus 12 percent waste = 9,520 square feet. Pallets needed: 9,520 / 450 = 21.2, rounded up to 22 pallets. Total weight: 22 x 1,800 pounds = 39,600 pounds or approximately 20 tons of sod. This requires a delivery truck with a lift gate or pallet jack.' },
        { heading: 'Cost and Material Planning', text: 'Sod at $0.45 per square foot: $4,284 delivered. Soil preparation (tilling, grading, starter fertilizer): $600. Installation labor at $0.30 per square foot if hiring out: $2,856. Total project cost: approximately $7,740. Installing in early fall gives the grass 6 to 8 weeks to root before winter dormancy.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Landscaping professionals follow critical guidelines for successful sod installation.',
      subsections: [
        { heading: 'Prepare the Soil Before Sod Arrives', text: 'Grade the soil to a smooth, consistent slope away from structures, till to 4 to 6 inches deep, and incorporate 1 to 2 inches of compost. The final soil grade should be 1 inch below adjacent hardscapes to allow for the sod thickness. Soil preparation takes 2 to 3 days and should be completed before sod delivery.' },
        { heading: 'Install Sod the Same Day It Arrives', text: 'Sod is a living product that deteriorates rapidly. Schedule installation for the same day as delivery. If some sod must be stored, unroll the pallets in a shaded area and keep them moist. Never stack pallets more than two high as the weight crushes the lower rolls and causes heat damage.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about sod estimation and lawn installation.',
      subsections: [
        { heading: 'How much sod is on a pallet?', text: 'A standard sod pallet contains 400 to 500 square feet of sod depending on the grower and grass type. Bermuda and zoysia pallets typically hold 450 to 500 square feet while fescue and bluegrass pallets hold 400 to 450 square feet because of the thicker turf layer.' },
        { heading: 'How long can sod sit on a pallet before installation?', text: 'Sod should ideally be installed within 12 to 24 hours of harvest. In cool, damp weather, it can survive 48 hours on the pallet. In hot summer weather, unstacked sod in shade lasts only 6 to 12 hours. Heat buildup in stacked pallets can kill the grass within 4 to 6 hours.' },
      ],
    },
  ],

  'septic-tank-calculator': [
    {
      title: 'What Is Septic Tank Sizing and Why Does It Matter?',
      content: 'Septic tank sizing determines the required liquid capacity based on household occupancy, daily wastewater flow, and local regulations. Accurate sizing ensures the tank provides adequate retention time for solid settlement and proper biological treatment without overloading the drain field.',
      subsections: [
        { heading: 'Understanding Septic System Fundamentals', text: 'A septic tank separates solids from wastewater, allowing anaerobic bacteria to partially treat the liquid before it flows to the drain field. The tank must hold wastewater for at least 24 to 48 hours to allow proper solids settling. A typical 3-bedroom home requires a 1,000-gallon minimum tank under most building codes.' },
        { heading: 'Why Accurate Sizing Is Critical', text: 'An undersized tank causes solids to wash into the drain field, clogging soil pores and causing system failure within 3 to 5 years. Drain field replacement costs $5,000 to $20,000. An oversized tank wastes money upfront ($200 to $500 extra per 250 gallons) and may not develop the bacterial colony needed for proper treatment.' },
        { heading: 'Regulatory Requirements and Minimum Sizes', text: 'Most state health departments follow the EPA design manual or local amendments. The minimum tank size ranges from 750 gallons for a 1-bedroom home to 1,500 gallons for a 5-bedroom home. Some jurisdictions require larger tanks based on fixture count, garbage disposals, or high-water-use appliances.' },
      ],
    },
    {
      title: 'How the Septic Tank Calculator Works',
      content: 'The calculator determines minimum tank capacity based on number of bedrooms, daily flow estimates, and local code requirements.',
      subsections: [
        { heading: 'The Flow-Based Sizing Formula', text: 'Daily flow equals number of bedrooms times 120 to 150 gallons per bedroom per day. A 4-bedroom home: 4 x 135 = 540 gallons per day. Minimum tank capacity equals daily flow times 1.5 to 2 for retention time: 540 x 2 = 1,080 gallons. Rounded up to standard sizes: 1,250 gallons.' },
        { heading: 'Input Parameters Explained', text: 'Number of bedrooms (the primary sizing factor), number of bathrooms (adjusts flow in some codes), presence of a garbage disposal (adds 50 percent to solids estimation), number of occupants if different from bedrooms, daily flow per person if known (typically 60 to 75 gallons per person), and local regulatory multiplier (1.5 to 2.5).' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Sizing a septic tank for a new 4-bedroom home demonstrates practical estimation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A custom home has 4 bedrooms, 3 bathrooms, a garbage disposal, and is designed for a family of 5. The local health department requires minimum 1,000 gallons for 4 bedrooms but recommends sizing based on actual flow estimates. The family uses about 70 gallons per person per day.' },
        { heading: 'Results and Interpretation', text: 'Estimated daily flow: 5 people x 70 gallons = 350 gallons. With garbage disposal, add 50 percent to solids load, increasing effective daily flow to 400 gallons. Minimum tank size: 400 x 2 (retention time) = 800 gallons. However, local code minimum for 4 bedrooms is 1,000 gallons. Final specification: 1,000-gallon concrete tank.' },
        { heading: 'Cost and Material Planning', text: 'A 1,000-gallon concrete septic tank costs $800 to $1,500 delivered and installed. Installation adds $500 to $1,500 for excavation and backfill. The complete septic system including drain field, distribution box, and permits totals $5,000 to $12,000. Pumping is recommended every 3 to 5 years at $250 to $400 per service.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Septic system professionals follow specific guidelines for tank selection and system design.',
      subsections: [
        { heading: 'Always Size for Future Capacity', text: 'If there is any possibility of future home additions, converting a den to a bedroom, or increased occupancy, size the tank one step larger. The additional cost of a 1,250-gallon tank over a 1,000-gallon tank is only $200 to $400, but upgrading later requires complete system replacement.' },
        { heading: 'Consider Two-Compartment Tanks', text: 'Two-compartment tanks provide better solids retention than single-compartment tanks of the same total volume. The first compartment captures 70 to 80 percent of solids while the second allows finer settlement. Many codes now require two-compartment tanks for improved treatment performance.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about septic tank sizing and maintenance.',
      subsections: [
        { heading: 'What size septic tank do I need for a 3-bedroom house?', text: 'Minimum 1,000 gallons is standard for a 3-bedroom home under most building codes. For a home with more than 3 bathrooms or a garbage disposal, upgrade to 1,250 gallons. The tank must provide at least 24 hours of retention time at peak daily flow.' },
        { heading: 'Can a septic tank be too big?', text: 'Yes, an excessively large tank can hinder proper bacterial activity. Wastewater in an oversized tank cools below the optimal temperature for anaerobic digestion and solids may settle too slowly in a wide tank. The tank should be sized within 20 percent of the calculated requirement for optimal biological performance.' },
      ],
    },
  ],

  'pool-volume-calculator': [
    {
      title: 'What Is Pool Volume Calculation and Why Does It Matter?',
      content: 'Pool volume calculation determines the total water capacity of swimming pools in gallons for chemical dosing, equipment sizing, and water billing. Accurate volume measurement is essential for safe sanitizer levels, proper pump operation, and cost-effective water treatment.',
      subsections: [
        { heading: 'Understanding Pool Shapes and Dimensions', text: 'Swimming pools come in three main shape categories: rectangular, circular/oval, and freeform irregular shapes. Each requires a different volume formula. An average 16-by-32-foot rectangular pool holds 15,000 to 20,000 gallons while a 24-foot round above-ground pool holds approximately 13,500 gallons at 52 inches deep.' },
        { heading: 'Why Accurate Volume Calculation Is Critical', text: 'Adding pool chemicals based on estimated volume leads to either under-treatment (algae growth, bacteria risk) or over-treatment (eye irritation, equipment corrosion). A 10 percent volume error on a 15,000-gallon pool means 1,500 gallons of dosage miscalculation — enough to cause persistent water quality issues.' },
        { heading: 'Impact on Equipment Sizing', text: 'Pool pumps, filters, heaters, and sanitizers must be sized to handle the total water volume within a specified turnover time. The pump must circulate the entire pool volume in 6 to 8 hours for residential pools. A 7,500-gallon error leads to a pump that is either too small (poor circulation) or oversized (wasted electricity).' },
      ],
    },
    {
      title: 'How the Pool Volume Calculator Works',
      content: 'The calculator computes water volume in gallons based on pool shape, dimensions, and average depth using standard geometric formulas.',
      subsections: [
        { heading: 'The Core Volume Formulas', text: 'Rectangular pool: length x width x average depth x 7.48 (gallons per cubic foot). A 16-by-32-foot pool with 3.5-foot shallow and 6-foot deep ends (average depth 4.75 feet): 16 x 32 x 4.75 x 7.48 = 18,195 gallons. Round pool: diameter squared x depth x 5.9. Oval pool: length x width x average depth x 6.7.' },
        { heading: 'Input Parameters Explained', text: 'Pool shape (rectangular, circular, oval, or freeform), length and width in feet, shallow end depth and deep end depth in feet (for calculating average depth), diameter for round pools, and for freeform pools, either a known surface area from a pool builder or dimensions for approximate calculation.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Balancing chemicals for a newly installed residential pool demonstrates practical volume calculation.',
      subsections: [
        { heading: 'Project Scenario', text: 'A freeform gunite pool measures 38 feet long and 18 feet wide at its widest point with an average width of 14 feet. The shallow end is 3.5 feet deep and the deep end is 7 feet deep. The pool builder provides the surface area: 532 square feet.' },
        { heading: 'Results and Interpretation', text: 'Average depth: (3.5 + 7) / 2 = 5.25 feet. Volume: 532 x 5.25 x 7.48 = 20,893 gallons. For chemical dosing: 3 ppm chlorine requires 0.52 gallons of 10 percent liquid chlorine. Initial pH adjustment with 1.5 pounds of sodium bisulfate lowers pH from 8.2 to 7.4 for this volume.' },
        { heading: 'Cost and Material Planning', text: 'Filling a 20,893-gallon pool costs $80 to $200 depending on local water rates. Chemical start-up kit for a pool this size: $150 to $300. Annual chemical costs: $600 to $1,200. Knowing the exact volume saves 15 to 20 percent on annual chemical costs through accurate dosing rather than guessing.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Pool service professionals rely on precise volume data for efficient pool maintenance.',
      subsections: [
        { heading: 'Verify Volume by Salt Addition', text: 'For the most accurate volume, add a known amount of salt (40 pounds per 10,000 gallons) and measure the resulting salinity change. A salt water pool with a salt generator provides easy volume verification. If the actual salinity is 10 percent below the calculated target, the pool volume is 10 percent larger than estimated.' },
        { heading: 'Account for Pool Features and Displacement', text: 'Steps, benches, and tanning ledges displace water and reduce actual volume by 2 to 5 percent. In-floor cleaning systems add water in the plumbing. For pools with attached spas, calculate the spa volume separately (typically 500 to 1,500 gallons) and add it to the main pool volume.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about pool volume calculation and maintenance.',
      subsections: [
        { heading: 'How do I calculate the volume of an irregular-shaped pool?', text: 'Split the pool into geometric shapes (rectangles, circles, triangles), calculate each section\'s volume, and sum them. Or use the surface area method: multiply surface area by average depth by 7.48. Most pool builders provide surface area on the construction plans.' },
        { heading: 'Why does pool volume matter for the pump system?', text: 'The pump must circulate the entire pool volume in 6 to 8 hours (the turnover rate). A 20,000-gallon pool needs a pump rated for 42 to 55 gallons per minute (20,000 / (8 x 60) = 41.7 GPM minimum). Undersized pumps cause poor circulation and algae problems while oversized pumps waste electricity.' },
      ],
    },
  ],

  'generator-sizing-calculator': [
    {
      title: 'What Is Generator Sizing and Why Does It Matter?',
      content: 'Generator sizing determines the appropriate wattage capacity for backup or portable power generation based on starting and running loads of connected equipment. Accurate sizing prevents overload trips, under-voltage damage to sensitive electronics, and unnecessary fuel consumption from an oversized generator.',
      subsections: [
        { heading: 'Understanding Generator Capacity Ratings', text: 'Generators have two power ratings: running (continuous) watts and starting (surge) watts. Running watts power equipment during normal operation while starting watts handle the 2- to 3-second surge when motors start. A typical well pump requires 1,500 running watts but 4,500 starting watts — triple the running load.' },
        { heading: 'Why Accurate Sizing Is Critical', text: 'An undersized generator cannot start motor-driven equipment and may stall or trip breakers when a refrigerator or furnace kicks on. An oversized generator costs 30 to 50 percent more upfront, burns 20 to 40 percent more fuel under partial load, and runs less efficiently, leading to carbon buildup and shorter engine life.' },
        { heading: 'The 80 Percent Rule and Load Management', text: 'Generators operate most efficiently at 50 to 80 percent of rated capacity. Running a generator at less than 30 percent load causes wet stacking in diesel engines and carbon fouling in gasoline engines. The ideal generator is sized so that typical running loads equal 60 to 75 percent of the generator\'s rated capacity.' },
      ],
    },
    {
      title: 'How the Generator Sizing Calculator Works',
      content: 'The calculator computes total running and starting watt requirements by summing individual appliance loads and applying demand factors.',
      subsections: [
        { heading: 'The Load Summation Method', text: 'Total running watts equals the sum of all appliance running watts multiplied by a demand factor (typically 0.7 to 0.9 for residential). Total starting watts equals the running total plus the largest single motor\'s starting surge. A home with 8,000 running watts and a 4,500-watt well pump surge needs a 12,500-watt generator.' },
        { heading: 'Input Parameters Explained', text: 'Appliance selection from a common household list (refrigerator, furnace, well pump, sump pump, lights, electronics, HVAC, etc.), number of each appliance, running watts per appliance, starting watts per appliance (motors require 2 to 4 times running watts), and a diversity factor if not all loads run simultaneously.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Sizing a backup generator for a typical 3-bedroom suburban home shows practical application.',
      subsections: [
        { heading: 'Project Scenario', text: 'A 2,400-square-foot home with central air (4 tons, 5,000 running / 12,000 starting watts), well pump (1,500 / 4,500), refrigerator (800 / 2,400), furnace fan (1,200 / 3,600), sump pump (900 / 2,700), lights (600), and electronics (500). The homeowner wants the generator to power all essential loads during a 3-day outage.' },
        { heading: 'Results and Interpretation', text: 'Total essential running watts: 5,000 + 1,500 + 800 + 1,200 + 900 + 600 + 500 = 10,500 watts. Largest starting surge: central AC at 12,000 watts. Generator must handle 10,500 running plus the AC starting surge: 10,500 + 7,000 (incremental surge above running) = 17,500 starting watts. Recommended: 14,000 running / 17,500 starting watt generator.' },
        { heading: 'Cost and Material Planning', text: 'A 14 kW standby generator costs $2,500 to $4,000 plus $1,500 to $3,000 for installation including automatic transfer switch and concrete pad. Natural gas consumption at 50 percent load: roughly 100 cubic feet per hour or $3 to $5 per day. Liquid-cooled models last 20 to 30 years versus air-cooled at 10 to 15 years.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Electrical contractors follow specific guidelines for generator selection and installation.',
      subsections: [
        { heading: 'Size for Motor Starting, Not Just Running Loads', text: 'The most common generator sizing mistake is ignoring starting surge. Electric motors draw 3 to 5 times their running current for 2 to 3 seconds during startup. A generator must have sufficient surge capacity to handle the largest motor plus the running load of all other equipment. Use a soft starter on AC units to reduce surge by 50 percent.' },
        { heading: 'Consider Future Load Additions', text: 'If you plan to add a pool pump, workshop equipment, or electric vehicle charger, size the generator 20 to 30 percent larger than current needs. A 20 kW generator costs only 25 percent more than a 14 kW unit but provides 43 percent more capacity. Future upgrades after installation are significantly more expensive.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about generator sizing and selection.',
      subsections: [
        { heading: 'What size generator do I need to run a house?', text: 'Essential loads for a typical 2,000- to 3,000-square-foot home require a 10,000 to 14,000 running watt generator. Whole-house coverage including electric water heater, electric range, and central air conditioning needs 20,000 to 30,000 running watts. A portable generator of 5,000 to 7,500 watts powers only critical circuits.' },
        { heading: 'Can I connect a portable generator to my house panel?', text: 'Yes, but only through a properly installed transfer switch or interlock kit. Backfeeding through a dryer outlet or direct plugging into a wall outlet is extremely dangerous and illegal — it energizes utility lines and risks electrocuting utility workers. A transfer switch installation costs $500 to $1,500 for a professional install.' },
      ],
    },
  ],

  'solar-panel-calculator': [
    {
      title: 'What Is a Solar Panel Calculator and Why Does It Matter?',
      content: 'A solar panel calculator estimates the number of photovoltaic panels, total system wattage, battery storage, and annual energy production for a residential or commercial installation. It factors in geographic location, roof azimuth, panel efficiency, and local sun hours to determine whether a solar array can offset a given electricity bill. Accurate sizing prevents undersizing (which leaves you on the grid) and oversizing (which wastes capital on unused capacity). With U.S. installed costs averaging $2.95 per watt in 2025, a miscalculation of just 1 kW can mean a $2,950 swing in upfront investment.',
      subsections: [
        { heading: 'Why Accurate Solar Sizing Matters', text: 'A 6 kW system in Phoenix (5.75 peak sun hours) generates roughly 8,600 kWh per year, while the same system in Seattle (3.5 peak sun hours) produces only 5,200 kWh. Using location-adjusted inputs prevents overpaying for panels that will never reach their rated output.' },
        { heading: 'Who Benefits from Solar Calculators', text: 'Homeowners evaluating a purchase, contractors bidding on installations, and DIY off-grid builders all rely on these calculators. A typical residential system in 2025 ranges from 5 kW to 12 kW, requiring 13 to 32 panels at 375 W to 415 W each.' },
        { heading: 'Key Input Parameters', text: 'Monthly electricity usage in kWh, roof area in square feet, panel wattage (typically 375-415 W), inverter efficiency (96-98%), battery capacity if adding storage, and local net metering policy all feed into the calculation.' },
      ],
    },
    {
      title: 'How a Solar Panel Calculator Works Step by Step',
      content: 'The calculator converts your monthly electricity usage into a daily kWh target, then divides by the average peak sun hours for your location to find the required DC system size. It then divides system size by individual panel wattage to determine the number of panels needed, while also checking available roof area. The final output includes annual production, payback period, and CO2 offset.',
      subsections: [
        { heading: 'Daily Energy Demand Calculation', text: 'If your annual usage is 10,800 kWh, daily demand is 29.6 kWh. In a location with 4.5 peak sun hours, you need a 6.58 kW DC system. This is before derating for inverter losses (typically 1.05-1.15 multiplier).' },
        { heading: 'Panel Count and Roof Space', text: 'Using 400 W panels, a 6.58 kW system needs 17 panels. Each panel is roughly 5.5 ft by 3.3 ft (18.2 sq ft), requiring 310 sq ft of roof area. Subtract 15% for walkways and setbacks to get usable area of about 264 sq ft.' },
        { heading: 'Battery and Inverter Matching', text: 'A hybrid inverter should handle 125% of the array STC rating. For a 6.58 kW array, choose an inverter rated at 8.2 kW. If adding a 10 kWh battery (like the Tesla Powerwall 3), the calculator ensures charge controller capacity matches the array voltage and current.' },
        { heading: 'Financial Outputs and Payback', text: 'At $2.95/watt installed, a 6.58 kW system costs $19,411 before the 30% federal tax credit ($5,823), netting $13,588. At $0.14/kWh retail electricity, annual savings of $1,512 yield a payback period of 9 years. Panels carry a 25-year warranty.' },
      ],
    },
    {
      title: 'Real-World Example: Sizing a Solar Array for a 2,000 Sq Ft Home',
      content: 'A family in Denver, Colorado uses 11,400 kWh annually. Their south-facing roof has 420 sq ft of usable space. Using the calculator with Denver\'s 5.2 peak sun hours and 400 W panels, we determine the exact system specification and financial return.',
      subsections: [
        { heading: 'System Size Calculation', text: 'Daily demand is 31.23 kWh. Divided by 5.2 sun hours gives 6.0 kW DC. With a 1.15 derate factor for inverter losses, the required array is 6.9 kW. This requires 18 panels (400 W each) occupying 328 sq ft, well within the 420 sq ft available.' },
        { heading: 'Energy Production Estimate', text: 'Annual production is 11,400 kWh at a 1.35 production ratio (Denver\'s high altitude boosts output). The system offsets 100% of current usage. With time-of-use billing, excess afternoon generation could earn $210 in net metering credits annually.' },
        { heading: 'Cost Breakdown and Incentives', text: 'System cost is $20,355, minus $6,107 federal tax credit = $14,248 net. Denver Xcel Energy offers a $500 rebate. Total net cost: $13,748. At $0.12/kWh, annual savings of $1,368 give a 10-year payback. The 25-year net savings exceed $20,000.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Solar Panel Calculator Accurately',
      content: 'Getting reliable results requires accurate inputs, realistic efficiency assumptions, and an understanding of local conditions. The most common errors involve ignoring shade, using wrong panel degradation rates, and forgetting inverter clipping losses.',
      subsections: [
        { heading: 'Account for Shading and Tilt', text: 'A tree shading just 10% of the array between 10 AM and 2 PM can reduce annual production by 15-25%. Use a shade analysis tool like Solmetric SunEye or the calculator\'s built-in shade factor (enter 0.85 if partial shade is unavoidable).' },
        { heading: 'Use Correct Panel Degradation', text: 'Most panels degrade at 0.5-0.7% per year. After 25 years, a 400 W panel produces only 320-340 W. A good calculator accounts for this in lifetime energy projections, not just first-year output.' },
        { heading: 'Check Inverter Sizing Ratio', text: 'The DC/AC ratio should be between 1.1 and 1.4. A ratio above 1.4 causes excessive clipping. For a 7.0 kW DC array, pair with a 5.8-6.4 kW inverter. Microinverters (like Enphase IQ8) allow independent panel optimization and bypass clipping issues.' },
        { heading: 'Verify Roof Structural Capacity', text: 'Each panel with racking weighs about 40-50 lbs. An 18-panel array adds 810-900 lbs. Ensure your roof rafters (typically 2x6 at 24 in OC for newer builds) can handle the dead load. Older roofs may need reinforcement at $1,200-$2,500 extra.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Solar Panel Calculators',
      content: 'Common questions address accuracy, battery integration, payback realism, and whether DIY solar is feasible. Below are answers based on 2025 industry standards.',
      subsections: [
        { heading: 'How accurate are online solar calculators?', text: 'Professional calculators like PVWatts from NREL achieve within 5-10% of real production when given accurate inputs. Free homeowner calculators are typically within 15-20% but may overestimate production by ignoring soiling and wiring losses (add 3-5% total).' },
        { heading: 'Can I go 100% off-grid with this calculator?', text: 'Yes, but battery storage must be sized for three days of autonomy. A 6.58 kW system with 30 kWh of battery (three Tesla Powerwall 3 units at $13,500 total) can support a typical home off-grid. The calculator will factor depth of discharge (80-90% for lithium) and inverter efficiency.' },
        { heading: 'Do I need to replace my roof before solar?', text: 'If your roof has less than 15 years of life remaining, replace it first. Solar panels last 25-30 years, and removing them mid-cycle costs $2,000-$4,000 for uninstall and reinstall. A new roof on a 2,000 sq ft home costs $8,000-$15,000.' },
        { heading: 'What happens to excess energy?', text: 'In net-metered states, excess kWh roll over as credits at the retail rate (e.g., $0.14/kWh). In states with net billing, excess is sold at the wholesale rate ($0.03-$0.07/kWh). Battery storage captures this excess instead; a 10 kWh battery can shift $1.40/day of excess to evening use.' },
      ],
    },
  ],
  'hvac-load-calculator': [
    {
      title: 'What Is an HVAC Load Calculator and Why Does It Matter?',
      content: 'An HVAC load calculator determines the heating and cooling capacity (in BTU/h or tons) needed to maintain a comfortable indoor temperature in a given building. It follows the ACCA Manual J methodology, accounting for square footage, insulation R-values, window U-factors, infiltration rates, and local climate data. An oversized unit short-cycles (wasting energy and dehumidification), while an undersized unit runs continuously without ever reaching the set point. In 2025, the average 2,000 sq ft home requires a 3-4 ton (36,000-48,000 BTU/h) system, but guessing can waste $800-$1,200 per year in excess utility costs.',
      subsections: [
        { heading: 'The Cost of Incorrect Sizing', text: 'A 5-ton unit on a 1,600 sq ft home that needs 2.5 tons cycles 6-8 times per hour, reducing efficiency by 25% and raising humidity to 65% RH versus the ideal 50%. The homeowner pays 30% more in electricity while feeling less comfortable.' },
        { heading: 'Who Needs a Load Calculation', text: 'HVAC contractors replacing equipment, homeowners considering mini-splits, builders designing new homes, and energy auditors all require Manual J calculations. Many building codes now mandate a load calculation before permit approval for HVAC replacements.' },
        { heading: 'Key Output Parameters', text: 'Sensible cooling load (BTU/h), latent cooling load (BTU/h), total cooling load (tons), heating load (BTU/h), required CFM per room, and recommended equipment efficiency (SEER2, HSPF2, EER2).' },
      ],
    },
    {
      title: 'How an HVAC Load Calculator Works Step by Step',
      content: 'The calculator performs a heat gain and heat loss analysis by summing all sources of heat transfer: conduction through walls, windows, ceilings, and floors; solar radiation through glazing; infiltration of outdoor air; internal gains from occupants, appliances, and lighting; and ventilation requirements. Each surface area is multiplied by its U-value (inverse of R-value) and the temperature difference between indoors and outdoors. The result is the total BTU/h required.',
      subsections: [
        { heading: 'Wall and Ceiling Heat Transfer', text: 'A 2,000 sq ft home with 8-ft ceilings has 1,600 sq ft of exterior wall area. At R-13 insulation (U=0.077) and a 30 degree F indoor-outdoor temperature difference, walls contribute 1,600 x 0.077 x 30 = 3,696 BTU/h. Ceilings at R-38 (U=0.026) and 2,000 sq ft add 1,560 BTU/h.' },
        { heading: 'Window Solar Heat Gain', text: '200 sq ft of double-pane windows (U=0.30, SHGC=0.25) on the west facade face peak afternoon sun. Solar heat gain = 200 x 0.25 x 248 BTU/h/sq ft (ASHRAE west-facing standard) = 12,400 BTU/h. This is often the largest single load component.' },
        { heading: 'Infiltration and Ventilation', text: 'At 0.35 ACH (typical for a moderately tight home), with 16,000 cubic ft of volume, infiltration adds 5,600 cubic ft/hour. Multiplying by 0.018 BTU/cu ft/degree F and a 30 degree F delta gives 3,024 BTU/h. Adding 50 CFM of mechanical ventilation (ASHRAE 62.2 minimum) contributes another 1,620 BTU/h.' },
        { heading: 'Internal Gains and Total Load', text: 'Four occupants (800 BTU/h each) add 3,200 BTU/h. Kitchen appliances, lighting, and electronics add 4,500 BTU/h. The total sensible load sums to approximately 30,000 BTU/h. Adding latent load (20% of sensible for humid climates) brings the total to 36,000 BTU/h, or exactly 3 tons.' },
      ],
    },
    {
      title: 'Real-World Example: Load Calculation for a 1,800 Sq Ft Ranch Home',
      content: 'A single-story brick ranch in Atlanta, Georgia with R-19 walls, R-30 attic, double-pane low-E windows, and five occupants needs a new 3-ton heat pump. Let\'s walk through the Manual J calculation room by room.',
      subsections: [
        { heading: 'Room-by-Room Load Breakdown', text: 'The 400 sq ft great room with 80 sq ft of south-facing windows has a cooling load of 10,200 BTU/h. Three bedrooms (300 sq ft each) contribute 6,800 BTU/h each. The kitchen (200 sq ft) adds 5,600 BTU/h from appliances and cooking. Total sensible: 28,200 BTU/h.' },
        { heading: 'Latent Load and Dehumidification', text: 'Atlanta\'s 90 degree F, 70% RH outdoor design condition requires significant latent removal. At 200 CFM of infiltration and 7 grains/lb moisture difference, latent load is 6,200 BTU/h. Total load: 34,400 BTU/h. A 3-ton unit (36,000 BTU/h) provides a 4.7% safety factor, ideal for the 1.15 oversizing limit.' },
        { heading: 'Duct Loss Compensation', text: 'If ducts run through a 130 degree F attic with R-6 insulation, 15% of cooling capacity is lost to the environment. The calculator inflates the equipment size by this factor: 34,400 BTU/h / 0.85 = 40,470 BTU/h. A 3.5-ton unit (42,000 BTU/h) is specified, but zoning can reduce this to two 2-ton units.' },
      ],
    },
    {
      title: 'Pro Tips for Using an HVAC Load Calculator Correctly',
      content: 'A load calculation is only as accurate as the inputs. Many contractors skip the math and rely on rules of thumb (e.g., 500 sq ft per ton), leading to oversized systems that perform poorly. Follow these tips for precise results.',
      subsections: [
        { heading: 'Measure Actual Window U-Values', text: 'Don\'t assume single-pane or double-pane. Check the NFRC label. A double-pane window can be U-0.30 (argon-filled, low-E) or U-0.50 (clear, air-filled). The difference between the two on a 2,000 sq ft home with 250 sq ft of windows is 1,200 BTU/h, or about 0.1 tons.' },
        { heading: 'Count All Internal Heat Sources', text: 'A home theater with a 4K projector (600 W), an AV receiver (500 W), and four occupants adds 4,100 BTU/h. A home office with a desktop PC (300 W), monitor (50 W), and two people adds 2,700 BTU/h. Forgetting these can under-size by 0.5-1 ton.' },
        { heading: 'Account for Duct Location', text: 'Ducts in conditioned space (basement, crawlspace) lose only 5% of capacity. Ducts in an attic can lose 15-30%. If ducts run through a 140 degree F attic and need to deliver 55 degree F air, the temperature differential of 85 degree F drives massive conduction losses. Insulate to at least R-8 and seal all joints with mastic.' },
        { heading: 'Use the Right Design Conditions', text: 'ASHRAE 2025 0.4% cooling design temperature varies dramatically. Phoenix uses 112 degree F, while San Francisco uses 82 degree F. Using the wrong outdoor design temperature can over-size by 1-2 tons. Always use the 99% heating and 1% cooling design values from the nearest weather station.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About HVAC Load Calculators',
      content: 'Homeowners and contractors alike have recurring questions about Manual J calculations, mini-split sizing, and whether they can DIY the process. Here are expert answers.',
      subsections: [
        { heading: 'Can I use square footage alone to size HVAC?', text: 'No. A 2,000 sq ft home with R-49 attic insulation, low-E windows, and a shaded lot may need only 2.5 tons, while the identical square footage with R-19, single-pane windows, and full sun exposure may need 4 tons. Square-foot-only rules of thumb are accurate only 40% of the time.' },
        { heading: 'Do mini-splits need a load calculation?', text: 'Yes, each indoor head requires a room-by-room load. A 12,000 BTU/h head (1 ton) covers about 400-500 sq ft in a well-insulated space, but a 200 sq ft sunroom with 100 sq ft of windows may need 9,000 BTU/h, while a same-size interior bedroom may need only 4,000 BTU/h.' },
        { heading: 'How do I calculate CFM for each room?', text: 'Divide each room\'s sensible load (BTU/h) by 1.08 times the temperature drop (typically 20 degree F for cooling). A room needing 8,000 BTU/h requires 8,000 / (1.08 * 20) = 370 CFM. This ensures supply registers are sized correctly.' },
        { heading: 'What software do professionals use?', text: 'Elite Software RHVAC (about $600/year), Wrightsoft Right-J ($500/year), and CoolCalc ($29/month) are the top three residential Manual J tools in 2025. All accept room-by-room inputs and generate ACCA-compliant reports accepted by permitting authorities.' },
      ],
    },
  ],

  'duct-sizing-calculator': [
    {
      title: 'What Is a Duct Sizing Calculator and Why Does It Matter?',
      content: 'A duct sizing calculator determines the optimal diameter or rectangular dimensions of HVAC ductwork to deliver the required airflow (CFM) to each room while minimizing pressure drop and noise. It uses the ACCA Manual D methodology, balancing friction rate, air velocity, and duct material roughness. Incorrectly sized ducts cause inadequate airflow - a 12-inch flex duct at 100 ft delivers only 600 CFM instead of the designed 800 CFM if undersized - leading to hot or cold rooms, system static pressure issues, and premature blower motor failure.',
      subsections: [
        { heading: 'The Cost of Undersized Ducts', text: 'A 3-ton system requiring 1,200 CFM forced through undersized 10-inch trunk ducts creates 1.2 inches of static pressure versus the designed 0.5 in. The blower motor draws 50% more power, raising annual electricity cost by $180-$250. High static pressure can also cause duct joint failures within 3-5 years.' },
        { heading: 'Who Uses Duct Sizing Calculations', text: 'HVAC contractors, mechanical engineers, energy auditors, and DIY homeowners adding a new room all need Manual D calculations. Many building codes now require a duct design submission for new construction and major HVAC replacements.' },
        { heading: 'Key Parameters and Outputs', text: 'Required inputs: room CFM, total equivalent length (TEL) of duct run, friction rate (typically 0.08-0.10 in w.c./100 ft), and duct type (flex, sheet metal, or fiberglass). Outputs: round duct diameter (4-20 in), rectangular duct dimensions, and air velocity in ft/min.' },
      ],
    },
    {
      title: 'How a Duct Sizing Calculator Works Step by Step',
      content: 'The calculator starts with the total system airflow (CFM) from the HVAC load calculation and distributes it proportionally to each room. For each duct run, it computes the friction loss based on duct length, number of fittings, and material roughness, then uses the Darcy-Weisbach equation or ASHRAE duct fitting database to select the smallest duct size that keeps velocity below 900 ft/min for main trunks and 600 ft/min for branches.',
      subsections: [
        { heading: 'Friction Rate Determination', text: 'Available static pressure (ASP) is the total external static pressure of the air handler minus the pressure drop of the coil, filter, and grilles. A typical 0.5 in w.c. ASP with a 200 ft total equivalent length yields a friction rate of 0.5 x 100 / 200 = 0.25 in w.c./100 ft. Most residential systems target 0.08-0.10 in w.c./100 ft.' },
        { heading: 'Round Duct Sizing Example', text: 'A branch supplying 200 CFM with a friction rate of 0.08 in w.c./100 ft requires a 10-inch round duct (velocity 366 ft/min). For contrast, a main trunk carrying 1,200 CFM at the same friction rate needs an 18-inch round duct (velocity 680 ft/min). Flex duct requires one size larger due to its corrugated surface (roughness 0.03 ft vs 0.0003 ft for sheet metal).' },
        { heading: 'Rectangular Duct Equivalent Size', text: 'To convert 18-inch round (254 sq in area) to rectangular: a 22 in x 12 in duct has 264 sq in, close enough. The calculator uses the ASHRAE round-to-rectangular equivalence chart, ensuring the rectangular duct has no more than 10% higher pressure drop than the round equivalent.' },
        { heading: 'Velocity and Noise Checks', text: 'The calculator flags any duct run where velocity exceeds 900 ft/min in main trunks (causing audible rumble) or 600 ft/min in branches (causing whooshing). A 12-inch round duct at 800 CFM has 1,019 ft/min velocity - too high. Upsizing to 14-inch reduces velocity to 749 ft/min, acceptable for a trunk line.' },
      ],
    },
    {
      title: 'Real-World Example: Duct Design for a 3-Ton Split System',
      content: 'A 1,800 sq ft home in Charlotte, North Carolina receives a new 3-ton heat pump with 1,200 CFM total airflow. The duct system uses flex duct in a conditioned crawlspace with a total equivalent length of 180 ft to the farthest register. Walk through the Manual D procedure.',
      subsections: [
        { heading: 'Airflow Distribution by Room', text: 'The 400 sq ft great room requires 350 CFM (10-in duct). Three bedrooms at 250 CFM each (8-in ducts). Kitchen at 200 CFM (8-in duct). Bathrooms at 50 CFM each (5-in ducts). Hallway return at 400 CFM (12-in duct). Total supply CFM: 1,200, matching system capacity.' },
        { heading: 'Trunk and Branch Sizing', text: 'The main trunk starts at 18-in round reducing to 16-in after 350 CFM branches off, then to 12-in after another 500 CFM. Each branch uses a 6-in flexible duct connected via a 6-in takeoff. All elbows are radius-to-diameter ratio of 1.5 to minimize pressure drop (equivalent length of 15 ft each).' },
        { heading: 'Static Pressure Verification', text: 'The calculated total pressure drop across the supply side is 0.22 in w.c., with 0.18 in w.c. on the return side. Total external static pressure is 0.40 in w.c., well within the air handler\'s rated 0.50 in w.c. at 1,200 CFM. This leaves 0.10 in w.c. margin for filter loading.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Duct Sizing Calculator',
      content: 'Manual D is detailed but forgiving if you follow best practices. Common mistakes include ignoring fitting losses, using flex duct on long runs without supports, and failing to balance the system.',
      subsections: [
        { heading: 'Count Every Fitting\'s Equivalent Length', text: 'A 6-in 90-degree flex duct elbow has an equivalent length of 20 ft. Five elbows on a run add 100 ft to the TEL, doubling the effective length. Use long-radius elbows (R/D = 1.5) to cut equivalent length to 10 ft each.' },
        { heading: 'Do Not Oversize Return Ducts', text: 'Return ducts should carry 80-100% of supply CFM but at higher velocity (up to 800 ft/min). Oversizing returns wastes space and material. A 12-in return handles 500 CFM at 636 ft/min with 0.08 in w.c./100 ft.' },
        { heading: 'Use the Correct Material Factor', text: 'Flex duct roughness adds 0.03 ft to the friction coefficient, requiring one size larger than sheet metal for the same CFM and friction rate. However, flex duct self-insulates (R-6 standard), avoiding condensation issues. Never use flex duct for trunks longer than 15 ft.' },
        { heading: 'Design for Future Filter Changes', text: 'A MERV 8 filter at 1,200 CFM drops 0.08 in w.c. clean and 0.30 in w.c. dirty (at 1 in thick). If the calculator assumes a clean filter, the system may be starved of airflow after three months. Upgrade to a 4-in media filter (0.05 in w.c. clean, 0.20 in w.c. dirty) for better margin.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Duct Sizing Calculators',
      content: 'Homeowners and HVAC professionals alike ask about flex vs. rigid duct sizing, the impact of long runs, and what happens if ducts are undersized.',
      subsections: [
        { heading: 'Can I use flex duct for the entire system?', text: 'Flex duct is acceptable for branch runs up to 30 ft and for any run with a pressure drop below 0.10 in w.c./100 ft. It is not recommended for trunks due to the high friction loss of the corrugated interior. A combined system - sheet metal trunk with flex branches - is the most cost-effective design.' },
        { heading: 'What is the minimum duct size for a bedroom?', text: 'A standard 12 ft x 12 ft bedroom with 1 occupant needs about 100 CFM. At 0.08 in w.c./100 ft, this requires a 6-in round duct. If the run exceeds 75 ft, upsize to 7-in to stay within the friction budget.' },
        { heading: 'How do I fix a room that is always hot or cold?', text: 'Check the damper first - 90% of imbalance is a closed or partially closed damper. If dampers are fully open, measure actual CFM with a flow hood. If measured CFM is below 80% of design, the duct is undersized. Replace with the next size up and re-balance.' },
        { heading: 'What happens if I undersize the return duct?', text: 'A 12-in return duct at 400 CFM is fine, but if 600 CFM is forced through it, velocity reaches 764 ft/min and noise jumps from NC-25 to NC-40 (clearly audible). The air handler also operates at negative pressure, potentially sucking air from unconditioned spaces.' },
      ],
    },
  ],

  'stairs-stringer-calculator': [
    {
      title: 'What Is a Stairs Stringer Calculator and Why Does It Matter?',
      content: 'A stairs stringer calculator computes the exact length, rise, run, and notch layout for stair stringers - the inclined structural members that support stair treads and risers. It uses the total vertical rise from finished floor to finished floor, along with chosen tread depth and riser height, to determine the number of steps, stringer length, and the precise layout of each step notch. A miscalculated stringer results in uneven steps that violate building code (maximum 7.75-inch riser, minimum 10-inch tread per IRC 2025), creating tripping hazards and failed inspections.',
      subsections: [
        { heading: 'Why Accurate Stringer Layout Matters', text: 'A 1/8-inch error in riser height across 14 steps accumulates to a 1.75-inch discrepancy at the top landing, requiring a shaved or shimmed top tread. This violates IRC code R311.7.5 and creates a visible, hazardous uneven step.' },
        { heading: 'Who Needs a Stringer Calculator', text: 'Carpenters framing stairs for new construction or renovations, DIY homeowners building decks, and contractors replacing old staircases. A typical residential staircase with a 108-inch total rise (9 ft ceiling) needs 14 risers at 7.71 inches each.' },
        { heading: 'Key Inputs and Outputs', text: 'Inputs: total rise (in), desired riser height (in), tread depth (in), tread thickness (in), and stringer material size (2x12 typical). Outputs: number of risers, number of treads, stringer length (ft), and notch dimensions for each step.' },
      ],
    },
    {
      title: 'How a Stairs Stringer Calculator Works Step by Step',
      content: 'The calculator divides the total rise by the desired riser height to get the number of risers, then adjusts riser height evenly so every step is identical. It uses the tread depth and the Pythagorean theorem to compute the stringer length along the diagonal, then lays out each notch by marking the rise and run on the 2x12 stringer stock.',
      subsections: [
        { heading: 'Riser Height Calculation', text: 'Total rise of 105 inches with desired riser of 7.5 inches gives 105 / 7.5 = 14 risers. The actual riser height becomes 105 / 14 = 7.5 inches exactly. If total rise is 106 inches, 106 / 14 = 7.571 inches, still within the IRC maximum of 7.75 inches. Always round up to the nearest riser count to keep risers under the max.' },
        { heading: 'Stringer Length (Diagonal) Calculation', text: 'For 13 treads at 10-inch run each, total run is 130 inches. With a total rise of 105 inches, the stringer length is the hypotenuse: sqrt(105^2 + 130^2) = sqrt(11,025 + 16,900) = sqrt(27,925) = 167.1 inches or 13.93 ft. A 2x12 stringer (16 ft stock) provides enough material.' },
        { heading: 'Notch Layout Using Framing Square', text: 'Set the framing square to 7.5 in on the tongue (rise) and 10 in on the blade (run). Mark each notch along the 2x12, keeping the square flush against the stringer edge. The calculator verifies that the remaining stringer thickness after notching is at least 3.5 inches (IRC requirement for structural integrity).' },
        { heading: 'Material Requirement Check', text: 'A 2x12 stringer is 11.5 inches wide. Notching removes 7.5 in (rise) from the top, leaving 4.0 in of continuous material, exceeding the 3.5 in minimum. If the notch depth approaches 8 in, a 2x12 must be upsized to a 2x14 (13.25 in wide) to maintain the minimum remaining thickness.' },
      ],
    },
    {
      title: 'Real-World Example: Deck Stair Stringers for a 48-Inch Deck',
      content: 'A deck is 48 inches above grade. With a 6-inch thick concrete landing, the total rise is 46.5 inches. The desired tread depth is 11 inches (code minimum plus 1 inch for comfort). Let\'s calculate the stringers for a 36-inch wide stair with three stringers.',
      subsections: [
        { heading: 'Step Count and Riser Height', text: '46.5 in / 7.75 in max riser = 6 risers. Actual riser height: 46.5 / 6 = 7.75 in (exactly at code max). Treads: 5 treads (one fewer than risers) at 11 in each. Total run: 55 in. Headroom clearance: the deck above must be at least 80 in from the stair nosing.' },
        { heading: 'Stringer Length and Stock Selection', text: 'Diagonal: sqrt(46.5^2 + 55^2) = sqrt(2,162 + 3,025) = sqrt(5,187) = 72.0 in, or 6.0 ft. Each of the three stringers requires an 8-ft 2x12. Notch depth is 7.75 in, leaving 3.75 in remaining on the 11.5-in 2x12, which exceeds the 3.5-in minimum.' },
        { heading: 'Landing and Bottom Connection', text: 'The bottom of each stringer rests on the concrete landing with a galvanized metal stand-off bracket to prevent rot. The top attaches to the deck rim joist using 1/2-in galvanized lag bolts (two per stringer). A 36-in wide stair needs three stringers spaced 18 in apart for adequate tread support.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Stairs Stringer Calculator',
      content: 'Even with a calculator, physical layout introduces error. The difference between a comfortable stair and a code violation often comes down to measuring technique and material choices.',
      subsections: [
        { heading: 'Measure Total Rise Three Times', text: 'Measure the total rise at both ends and the middle of the staircase opening. Floors are rarely perfectly level - a 1/4-inch variation across a 36-in opening is common. Use the largest measurement to ensure no step exceeds the maximum riser height.' },
        { heading: 'Add Tread Thickness to First Riser', text: 'If treads are 1-in thick and the first riser is measured from the landing, subtract tread thickness from the first riser height. For a 7.75-in riser with 1-in tread, cut the first riser at 6.75 in. The calculator should include a tread thickness input to handle this automatically.' },
        { heading: 'Account for Stringer Spacing and Span', text: 'For stairs wider than 36 in, use four stringers spaced 16 in apart. For 48-in wide stairs, five stringers at 12 in spacing. The stair tread material (2x6 decking or 1-in hardwood) must span between stringers; 2x6 at 16-in spacing is acceptable, but at 24-in spacing it feels bouncy.' },
        { heading: 'Use Pressure-Treated Lumber for Exterior', text: 'Deck stringers require pressure-treated #2 grade 2x12 SYP (southern yellow pine). The notching exposes end grain, which wicks moisture. Apply a water-resistant sealant to all cut faces. For interior stairs, use kiln-dried Douglas fir or LVL (laminated veneer lumber) for minimal shrinkage.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Stairs Stringer Calculators',
      content: 'Common stringer questions from carpenters and DIYers: code compliance, winder stairs, landings, and whether to use a cutting template.',
      subsections: [
        { heading: 'What is the maximum riser height allowed by code?', text: 'IRC 2025 limits residential risers to a maximum of 7.75 in and a minimum of 4 in. The maximum variation between adjacent risers is 3/16 in, and the total variation across the entire staircase cannot exceed 3/8 in.' },
        { heading: 'How do I calculate winder stairs?', text: 'Winder stairs (pie-shaped treads) require the tread depth to be at least 10 in measured 12 in from the narrow end per IRC R311.7.4. The calculator must handle variable-angle stringers. Use a dedicated winder calculator or stair design software for accuracy.' },
        { heading: 'When do I need a landing?', text: 'Per IRC R311.7.6, any stair flight with a total vertical rise exceeding 12 ft must have an intermediate landing at least 36 in long in the direction of travel. Most residential stairs (9-10 ft ceilings) do not need a landing.' },
        { heading: 'Can I build stringers from 2x10 instead of 2x12?', text: '2x10 stock is 9.25 in wide. With a 7.75-in notch depth, only 1.5 in of material remains, well below the 3.5-in minimum. 2x10 is acceptable only for very shallow steps (e.g., 4-in risers for low-slope stairs). Always use 2x12 or 2x14 for standard residential stairs.' },
      ],
    },
  ],

  'handrail-calculator': [
    {
      title: 'What Is a Handrail Calculator and Why Does It Matter?',
      content: 'A handrail calculator determines the total length of handrail tubing, number of wall brackets, number of flanges, and the optimal bracket spacing for a given staircase or ramp. It accounts for the horizontal projection of the stair (total run), the diagonal length along the stair slope, and the required handrail height (34-38 inches per IRC 2025 for residential, 36-42 inches per IBC for commercial). Incorrect bracket spacing (maximum 48 inches per IRC) can cause the handrail to flex under load, creating a safety hazard and failed inspection.',
      subsections: [
        { heading: 'Why Bracket Spacing Matters', text: 'A handrail with brackets spaced 60 in apart instead of 48 in deflects 0.25 in under a 200-lb load, exceeding the max 0.125-in deflection allowed by code. The same rail with brackets at 42 in deflects only 0.06 in, well within limits.' },
        { heading: 'Who Needs a Handrail Calculator', text: 'Homeowners installing new railings, general contractors finishing basements or decks, commercial contractors building ADA-compliant ramps, and metal fabricators cutting custom handrail sections.' },
        { heading: 'Key Outputs', text: 'Total handrail length (ft), number of brackets, number of flanges (for wall-mounted), number of returns (for over-the-post mounting), and recommended bracket spacing across the run.' },
      ],
    },
    {
      title: 'How a Handrail Calculator Works Step by Step',
      content: 'The calculator computes the diagonal length of the handrail along the stair slope using the total rise and total run. It then divides this length by the code-specified maximum bracket spacing (48 in for IRC residential, 72 in for IBC commercial with engineered rail) and rounds up to determine the minimum number of brackets needed.',
      subsections: [
        { heading: 'Diagonal Length Calculation', text: 'For a staircase with a total rise of 105 in and total run of 130 in, the diagonal length is sqrt(105^2 + 130^2) = 167.1 in, or 13.93 ft. This is the handrail length needed, assuming it runs parallel to the stair slope from the nosing of the top tread to the nosing of the bottom tread.' },
        { heading: 'Bracket Count Determination', text: '167.1 in / 48 in max spacing = 3.48, rounded up to 4 gaps, meaning 5 brackets. Additional brackets: one within 6 in of the top landing and one within 6 in of the bottom landing brings the total to 7 brackets. Actual spacing = 167.1 / 6 gaps between 7 brackets = 27.9 in, well under 48 in.' },
        { heading: 'Wall-Mounted vs. Post-Mounted', text: 'For wall-mount, each bracket requires a flange and two 3-in #10 wood screws into studs. For post-mount (deck stairs), a 3-in OD aluminum post with a base plate replaces every third bracket. The calculator outputs the quantity of each component.' },
        { heading: 'Handrail Height Verification', text: 'The calculator checks that the handrail height above the stair nosing is between 34 and 38 in throughout. On a curved or angled run, the vertical height must be measured from the nosing at each tread. A consistent slope ensures the handrail height does not vary by more than 3 in across the entire stair.' },
      ],
    },
    {
      title: 'Real-World Example: Handrail for a 13-Step Basement Staircase',
      content: 'A basement staircase has 13 risers at 7.5 in (total rise 97.5 in) and 12 treads at 10 in (total run 120 in). The homeowner wants a black wrought-iron wall-mounted handrail with 1.5-in diameter tubing.',
      subsections: [
        { heading: 'Handrail Length and Material', text: 'Diagonal length: sqrt(97.5^2 + 120^2) = sqrt(9,506 + 14,400) = sqrt(23,906) = 154.6 in, or 12.88 ft. Order a 13-ft section of 1.5-in schedule 40 black iron pipe. For a two-piece rail (with a center weld), add 2 in for overlap and grinding.' },
        { heading: 'Bracket and Flange Count', text: '154.6 in / 48 in max spacing = 3.22, so 4 gaps requiring 5 brackets. Add top and bottom brackets within 6 in of each end: total 7 brackets at 22 ft-lb tightening torque. Each bracket needs a wall flange anchored into 1/2-in Toggle bolts (plaster walls) or 3-in wood screws (studs).' },
        { heading: 'Returns and Wall Clearance', text: 'The handrail returns to the wall at the top and bottom (curved 180-degree returns). Each return adds 6 in of tubing and requires one additional bracket. Total tubing: 13 ft straight + 1 ft returns = 14 ft. Wall clearance is set to 2 in from the wall surface to the handrail centerline.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Handrail Calculator',
      content: 'Precision in handrail layout differentiates a professional installation from a wobbly afterthought. These tips ensure code compliance, structural integrity, and a clean aesthetic.',
      subsections: [
        { heading: 'Always Bracket Within 6 Inches of Ends', text: 'IRC R311.7.8 requires handrails to extend at least 12 in beyond the top and bottom risers, and the handrail must be continuous. Brackets must be placed within 6 in of the start and end of the rail. This prevents deflection at the most heavily loaded points.' },
        { heading: 'Match Bracket Type to Wall Material', text: 'Drywall over studs: use wood screws into studs. Brick or concrete: use 1/4-in Tapcon masonry anchors with a 1-in embedment depth. Metal stud walls: use toggle bolts rated for 150 lb shear. The calculator should ask for wall type to specify the correct fastener.' },
        { heading: 'Account for Handrail Diameter and Grip', text: 'IRC requires a handrail diameter between 1.25 in and 2 in for adequate grip. A 1.5-in round tube is the most comfortable for most hand sizes. For rectangular rails, the perimeter must be 4-6.25 in with a maximum cross-section of 2.25 in.' },
        { heading: 'Continuous Handrail Rule on Landings', text: 'If the staircase has a mid-landing, the handrail must be continuous across the landing without a break. The calculator adds a 4-ft horizontal section at each landing with brackets at 48-in max spacing, maintaining the same handrail height throughout.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Handrail Calculators',
      content: 'DIY installers and homeowners often have questions about code minimums, angled vs. straight rails, and outdoor material choices.',
      subsections: [
        { heading: 'What is the code minimum handrail height?', text: 'For residential stairs, IRC 2025 requires the handrail height to be between 34 in and 38 in, measured vertically from the stair nosing to the top of the handrail. For commercial stairs, IBC requires 36-42 in. For wheelchair ramps, ADA requires 34-38 in continuous.' },
        { heading: 'Can I install a handrail on one side only?', text: 'IRC requires a handrail on at least one side of stairs with four or more risers. If the stair is wider than 44 in, a handrail is required on both sides. IBC requires handrails on both sides of all stairs regardless of width.' },
        { heading: 'How do I cut a handrail at the correct angle?', text: 'The handrail angle equals the stair pitch angle = arctan(rise / run) = arctan(7.5 / 10) = 36.87 degrees. Cut the handrail ends at this angle for a seamless transition to the wall returns.' },
        { heading: 'What material is best for outdoor handrails?', text: 'For exterior installations, use 316-grade stainless steel (rust-resistant, $18-$25 per linear ft) or powder-coated aluminum (lighter, $12-$18 per linear ft). Avoid plain steel and standard wrought iron, which rust within 2-3 years outdoors.' },
      ],
    },
  ],

  'ramp-calculator': [
    {
      title: 'What Is a Ramp Calculator and Why Does It Matter?',
      content: 'A ramp calculator determines the required ramp length, slope percentage, rise per foot, and number of intermediate landings needed for wheelchair access or equipment loading. It uses the total vertical rise and the desired slope ratio - ADA standards require a 1:12 slope (8.33% grade) for wheelchair ramps, meaning 1 inch of rise requires 12 inches of ramp length. A ramp that is too steep creates a safety hazard; a 1:10 slope exceeds ADA guidelines and makes manual wheelchair propulsion difficult or impossible for many users.',
      subsections: [
        { heading: 'Why Slope Ratio Is Critical', text: 'A 30-inch rise (typical for a 30-in threshold) at 1:12 slope requires 30 ft of ramp. At 1:10, the ramp is only 25 ft but the 10% grade makes it too steep for unassisted wheelchair use. The 2025 ADA still mandates 1:12 max for new construction, but 1:10 may be allowed for existing buildings with variance.' },
        { heading: 'Who Uses a Ramp Calculator', text: 'Homeowners adding wheelchair access, contractors building commercial ADA ramps, event planners setting up temporary ramps, and loading dock designers calculating fork truck approach angles.' },
        { heading: 'Key Outputs', text: 'Total ramp length (ft), number of landings, landing dimensions, rise per foot (in), slope percentage (%), and angle in degrees.' },
      ],
    },
    {
      title: 'How a Ramp Calculator Works Step by Step',
      content: 'The calculator divides the total rise by the chosen slope ratio (e.g., 12 for 1:12) to get the minimum ramp length. For rises exceeding 30 in, it inserts intermediate landings every 30 ft of ramp length (ADA requirement). Each landing must be at least 60 in long to allow a wheelchair to turn around.',
      subsections: [
        { heading: 'Ramp Length Calculation', text: 'A 36-inch rise at 1:12 slope: 36 x 12 = 432 in = 36 ft. At 1:16 (a gentler slope often preferred for long-term accessibility): 36 x 16 = 576 in = 48 ft. The calculator also checks that the slope percentage (rise / run x 100) does not exceed 8.33% for ADA compliance.' },
        { heading: 'Landing Placement', text: 'Every 30 ft of ramp requires a 5-ft intermediate landing. For a 36-ft ramp: 30 ft segment + 5 ft landing + 6 ft remaining segment = 41 ft total length including the landing. Each landing must be at least as wide as the ramp (minimum 36 in ADA).' },
        { heading: 'Slope Conversion and Grade', text: 'A 1:12 slope = 8.33% grade = 4.76 degrees. For comparison, a 1:20 slope = 5% grade = 2.86 degrees (typical for van access). Most building codes set 1:20 as the maximum slope for vehicular access. The calculator outputs all three formats.' },
        { heading: 'Handrail Requirements', text: 'Ramps with a rise greater than 6 in require handrails on both sides at 34-38 in height. The calculator extends the handrail calculation: for a 36-ft ramp with 4-ft landing, handrail length per side = 41 ft + 12 in extensions at top and bottom = 43 ft per side, totaling 86 ft of handrail.' },
      ],
    },
    {
      title: 'Real-World Example: Front Entry Ramp for a 24-Inch Step',
      content: 'A homeowner needs a wheelchair ramp to a front door 24 inches above grade. The approach is straight (no turns). The door opens outward with a 36-in wide landing.',
      subsections: [
        { heading: 'Ramp Length and Slope', text: '24-in rise x 12 = 288 in = 24 ft of ramp. Slope is 8.33% at 1:12. The ramp width is 36 in (ADA minimum). Total ramp area: 24 ft x 3 ft = 72 sq ft. Surface material: 1/4-in diamond-plate aluminum for slip resistance.' },
        { heading: 'Top Landing Design', text: 'The top landing must be 60 in x 60 in minimum to allow wheelchair turning. The existing stoop is 36 in deep, so it must be extended 24 in. The landing surface slopes 0.25 in/ft for drainage (maximum 0.5 in/ft).' },
        { heading: 'Drainage and Under-Ramp Storage', text: 'The ramp is built with 6-in gravel base under 4-in concrete, with a 0.5-in/ft cross slope for water runoff. Under the ramp, the 24-ft x 36-in space (72 sq ft) is enclosed with lattice for storage.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Ramp Calculator',
      content: 'Beyond basic slope math, several real-world factors affect ramp usability and code compliance. These tips cover drainage, surface grip, and modular ramp considerations.',
      subsections: [
        { heading: 'Always Add a Cross Slope for Drainage', text: 'ADA requires a maximum cross slope of 2% (0.25 in/ft) to prevent water pooling. Without a cross slope, rain creates a slip hazard. Use a 1/8-in per foot cross slope for indoor ramps, 1/4-in per foot for outdoor ramps in freeze-thaw climates.' },
        { heading: 'Choose Surface Texture Carefully', text: 'Smooth concrete wet with leaves has a coefficient of friction below 0.5 (marginal). Diamond-plate aluminum, rubber matting, or broom-finished concrete achieve 0.7-0.8 COF. For ice-prone areas, install electric heat tape ($15/ft) embedded in the ramp surface.' },
        { heading: 'Consider a Modular Ramp for Flexibility', text: 'Modular aluminum ramps cost $100-$150 per linear ft installed, versus $50-$80 per sq ft for poured concrete. A 24-ft modular ramp system with two 5-ft landings runs $3,500-$5,000 installed but can be relocated.' },
        { heading: 'Check Door Swing and Clearance', text: 'If the door swings outward over the ramp landing, the 60-in landing depth prevents the door from hitting the wheelchair. For inward-swinging doors, the landing must still be 60 in to allow wheelchair positioning.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Ramp Calculators',
      content: 'Common questions involve slope adjustments, turning radii, temporary ramps, and site-specific exceptions to ADA rules.',
      subsections: [
        { heading: 'Can I exceed 1:12 slope for a residential ramp?', text: 'ADA applies to commercial/public buildings. For private homes, IRC 2025 allows a maximum 1:8 slope (12.5%) for ramps serving the primary entrance, but recommends 1:12. A 1:8 slope requires a handrail and edge protection.' },
        { heading: 'How much space does a ramp turn need?', text: 'A 90-degree turn requires a 60 in x 60 in landing at the corner. A 180-degree switchback requires a 60 in x 72 in landing. The turning platform must allow a 360-degree wheelchair rotation within a 60-in diameter circle.' },
        { heading: 'What is the cheapest ramp option?', text: 'A treated-wood ramp with plywood decking costs $30-$50 per linear ft in materials for a 36-in wide ramp. For a 24-ft ramp with two landings, total material cost is approximately $1,200-$2,000.' },
        { heading: 'Do I need a permit for a ramp?', text: 'Most municipalities require a building permit for any ramp with a rise over 12 in. Permit fees range from $50 to $300. You will need site plans showing the ramp location, property lines, and setback compliance.' },
      ],
    },
  ],

  'concrete-mix-calculator': [
    {
      title: 'What Is a Concrete Mix Calculator and Why Does It Matter?',
      content: 'A concrete mix calculator determines the precise quantities of cement, sand, aggregate, and water needed for a given concrete volume at a specified mix ratio, most commonly 1:2:3 (cement : sand : gravel) for standard 3,000 psi concrete. It converts the volumetric ratio into weight or bag counts, accounting for material density, moisture content, and wastage. A miscalculated mix - too much water reduces strength by 500 psi per extra gallon per bag, while too little aggregate causes shrinkage cracking at a rate of 0.05-0.08% of volume.',
      subsections: [
        { heading: 'Why Accurate Proportions Matter', text: 'A 1:2:3 mix for 1 cubic yard requires 7 bags of cement (94 lb each), 1,400 lb of sand, and 2,100 lb of gravel. Adding an extra 3 gallons of water drops the water-cement ratio from 0.50 to 0.60, reducing 28-day compressive strength from 4,000 psi to 3,000 psi.' },
        { heading: 'Who Uses a Concrete Mix Calculator', text: 'Contractors pouring slabs and footings, DIY homeowners building patios or walkways, and ready-mix plant operators adjusting batch recipes. A typical 20 ft x 20 ft x 4 in slab requires 4.94 cubic yards of concrete.' },
        { heading: 'Key Outputs', text: 'Required cement bags (94 lb or 50 kg), sand weight and volume, gravel weight and volume, water volume, water-cement ratio, and expected compressive strength in psi.' },
      ],
    },
    {
      title: 'How a Concrete Mix Calculator Works Step by Step',
      content: 'The calculator multiplies the slab or footing dimensions to get total concrete volume, adds a wastage factor (5-10%), then applies the specific mix ratio to determine the dry volume of each component. It accounts for the fact that dry ingredients occupy about 1.5 times the volume of finished concrete due to voids between particles.',
      subsections: [
        { heading: 'Volume Calculation', text: 'A 24 ft x 24 ft x 4 in slab: 24 x 24 x 0.333 = 192 cubic ft / 27 = 7.11 cubic yards. Adding 10% waste gives 7.82 cubic yards. For a 1:2:3 mix, total dry volume = 7.82 x 1.54 = 12.04 cubic yards (the 1.54 factor accounts for void reduction during mixing and compaction).' },
        { heading: 'Cement and Aggregate Quantities', text: 'For 1:2:3 mix (6 total parts): cement = 12.04 / 6 = 2.01 cu yd x 2,700 lb/cu yd = 5,417 lb / 94 lb/bag = 57.6 bags (round to 58 bags). Sand = 2.01 x 2 = 4.01 cu yd x 2,700 = 10,827 lb. Gravel = 2.01 x 3 = 6.02 cu yd x 2,700 = 16,254 lb.' },
        { heading: 'Water-Cement Ratio', text: 'For 4,000 psi concrete, target water-cement ratio is 0.45-0.50 by weight. 58 bags x 94 lb = 5,452 lb cement. Water = 5,452 x 0.48 = 2,617 lb / 8.33 lb/gal = 314 gallons. Adding water beyond this causes bleeding and scaling on the finished surface.' },
        { heading: 'Batching by Bag Count', text: 'For small pours, use the 1:2:3 per-bag method: 1 bag cement (94 lb) + 2 shovels sand (94 lb each) + 3 shovels gravel (94 lb each) + 6.5 gallons water. One bag yields about 0.6 cubic ft (0.022 cu yd) of finished concrete.' },
      ],
    },
    {
      title: 'Real-World Example: 10 ft x 12 ft Patio Slab Mix Design',
      content: 'A homeowner is pouring a 10 ft x 12 ft x 4 in patio slab with 3,000 psi concrete. The subgrade is compacted gravel with a vapor barrier. Let\'s calculate the exact batch quantities for a 1:2:3 mix with 0.50 w/c ratio.',
      subsections: [
        { heading: 'Volume and Dry Mix Calculation', text: '10 ft x 12 ft x 0.333 ft = 40 cu ft / 27 = 1.48 cu yd. Add 5% waste = 1.56 cu yd. Dry volume = 1.56 x 1.54 = 2.40 cu yd. For 1:2:3: each part = 2.40 / 6 = 0.40 cu yd. Cement = 0.40 x 2,700 / 94 = 11.5 bags (round to 12 bags). Sand = 0.80 cu yd (2,160 lb). Gravel = 1.20 cu yd (3,240 lb).' },
        { heading: 'Water Requirement', text: '12 bags x 94 lb = 1,128 lb cement. At 0.50 w/c ratio: 1,128 x 0.50 = 564 lb water / 8.33 = 67.7 gallons. If the sand is damp (6% moisture), subtract 2,160 x 0.06 = 130 lb water. Net added water: 564 - 130 = 434 lb / 8.33 = 52.1 gallons.' },
        { heading: 'Batch Method and Mixing', text: 'Using a 6-cu-ft mixer (3.5-bag capacity per batch), the pour requires 4 batches. Each batch: 3 bags cement + 540 lb sand + 810 lb gravel + 13 gallons water mixed for 4 minutes after all ingredients are in the drum. Slump test target: 4 in.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Concrete Mix Calculator',
      content: 'The difference between a durable slab and a cracked, scaling failure often lies in moisture correction, aggregate angularity, and proper curing.',
      subsections: [
        { heading: 'Adjust for Aggregate Moisture', text: 'Dried sand absorbs 0.5-1% water by weight. Wet sand contains 4-6% water. For 2,160 lb of sand at 5% moisture, there are 108 lb of free water. Reduce batch water by that amount or the w/c ratio climbs from 0.50 to 0.56, reducing strength by 700 psi.' },
        { heading: 'Match Aggregate Size to Pour Thickness', text: 'For a 4-in slab, max aggregate size is 3/4 in. For a 12-in thick footing, use 1.5-in aggregate. Larger aggregate reduces cement paste demand, saving $3-$5 per cubic yard. Never exceed 1/3 the slab thickness for aggregate diameter.' },
        { heading: 'Account for Rebar and Reinforcement', text: 'A 4-in slab on grade with 6x6 W2.9/W2.9 wire mesh requires 6.5 lb/sq ft of reinforcement. For the 120 sq ft patio: 780 lb of mesh. If using #3 rebar at 18 in OC each way, each 10-ft bar weighs 0.376 lb/ft.' },
        { heading: 'Curing Time Affects Final Strength', text: 'Concrete cured for 7 days reaches about 70% of 28-day strength. Properly moist-cured for 28 days achieves 100%. A 4,000 psi mix that is allowed to dry out after 3 days may only reach 2,800 psi.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Concrete Mix Calculators',
      content: 'Homeowners and contractors frequently ask about bagged vs. ready-mix, winter pouring, and strength testing.',
      subsections: [
        { heading: 'How many 80-lb bags equal 1 cubic yard?', text: 'An 80-lb bag of premix (like Quikrete) yields approximately 0.6 cu ft. One cubic yard = 27 cu ft / 0.6 = 45 bags. For a 1:2:3 mix using separate materials, 7 bags of 94-lb cement plus sand and gravel produces 1 cu yard.' },
        { heading: 'Can I use a 1:2:3 mix for a countertop?', text: 'No. Countertops need 6,000+ psi concrete with a 1:1.5:2 mix (cement : sand : gravel) and a w/c ratio of 0.40 or less. Use 3/8-in pea gravel and add a high-range water reducer (superplasticizer) to maintain workability.' },
        { heading: 'What is the best mix for cold-weather pours?', text: 'Use Type III high-early-strength cement (reaches 2,000 psi in 3 days vs. 7 days for Type I). Add calcium chloride accelerator at 2% by cement weight. Use hot water (140 degree F max) and insulate the pour with 2-in rigid foam for 5 days.' },
        { heading: 'How do I test my mix strength on-site?', text: 'Cast three 6-in x 12-in test cylinders per pour. Cure them alongside the slab (not in water). Send to a lab for 7-day and 28-day compressive testing. Cost: $50-$100 per test.' },
      ],
    },
  ],

  'mortar-mix-calculator': [
    {
      title: 'What Is a Mortar Mix Calculator and Why Does It Matter?',
      content: 'A mortar mix calculator determines the precise quantities of cement, lime, sand, and water needed for brick or block laying based on the mortar type (Type N, S, or M), the number of bricks/blocks, and the joint thickness. Mortar makes up about 7% of a brick wall\'s volume but provides 100% of the bond strength. Using the wrong type - Type N (750 psi) for a retaining wall instead of Type S (1,800 psi) - can lead to joint failure within 3-5 years of freeze-thaw cycling.',
      subsections: [
        { heading: 'Why Mortar Type Selection Matters', text: 'Interior non-load-bearing walls need Type N (1:1:6 mix of cement, lime, sand). Exterior walls above grade need Type S (1:0.5:4.5). Foundations and retaining walls need Type M (1:0.25:3.5). A miscalculated Type N on a foundation wall cracks under hydrostatic pressure within two winters.' },
        { heading: 'Who Uses a Mortar Calculator', text: 'Masons laying brick or block, DIY homeowners building garden walls or fire pits, and restoration contractors replicating historic lime mortars. A typical 8-in block wall requires 0.007 cubic yards of mortar per block.' },
        { heading: 'Key Outputs', text: 'Number of bricks/blocks, mortar volume (cu ft), cement bags (94 lb), lime bags (50 lb), sand volume (cu ft), and number of batch mixes required for the job.' },
      ],
    },
    {
      title: 'How a Mortar Mix Calculator Works Step by Step',
      content: 'The calculator counts the number of bricks or blocks based on wall dimensions and unit size, then multiplies by the mortar volume per unit (accounting for head and bed joints). It adjusts for wastage (15-20%) and converts the required mortar volume into raw material quantities using the selected mortar type\'s proportions.',
      subsections: [
        { heading: 'Brick Count and Mortar Volume', text: 'For a 10 ft x 8 ft wall with standard modular bricks (2.25 x 3.75 x 8 in) and 3/8-in joints: 10 ft x 12 in/ft = 120 in / 8 in brick length = 15 bricks per row. 8 ft x 12 = 96 in / 2.25 in brick height = 42.7 rows. Total: 15 x 43 = 645 bricks. Mortar volume per brick: ~0.020 cu ft (head + bed joints).' },
        { heading: 'Total Mortar Quantity', text: '645 bricks x 0.020 cu ft = 12.9 cu ft. Adding 20% waste = 15.5 cu ft = 0.57 cu yd. For Type S mortar (1:0.5:4.5 = 6 parts total): cement = 0.57 / 6 x 1 x 2,700 / 94 = 2.73 bags (round to 3 bags). Lime = 0.57 / 6 x 0.5 x 2,000 / 50 = 1.9 bags (round to 2 bags).' },
        { heading: 'Block Wall Calculation', text: 'For 8-in concrete blocks (7.625 x 7.625 x 15.625 in actual) with 3/8-in joints: each block covers 16 x 8 in = 128 sq in. A 10 ft x 8 ft wall: 11,520 sq in / 128 = 90 blocks. Mortar per block: 0.007 cu yd = 0.19 cu ft. Total mortar: 90 x 0.19 = 17.1 cu ft + 15% waste = 19.7 cu ft.' },
        { heading: 'Water Addition and Mixing', text: 'For Type S mortar, add 3.5-4.5 gallons of water per 94-lb bag of cement. For a 3-bag batch: 10.5-13.5 gallons total. Add water gradually until the mortar has a spread of 110-130 mm on the flow table. Mortar that is too wet (175 mm spread) loses 30% of its bond strength.' },
      ],
    },
    {
      title: 'Real-World Example: Building a Brick Garden Wall 20 ft x 3 ft',
      content: 'A homeowner wants a decorative 20-ft long, 3-ft high brick garden wall using standard modular bricks with Type N mortar (interior non-load-bearing).',
      subsections: [
        { heading: 'Brick Count and Pattern', text: '20 ft x 12 = 240 in / 8 in brick = 30 bricks per row. 3 ft x 12 = 36 in / 2.25 in brick = 16 rows. Total: 30 x 16 = 480 bricks. A running bond pattern adds 5% waste for half-bricks at ends: 480 x 1.05 = 504 bricks. Each brick weighs 4.5 lb, total brick weight: 2,268 lb.' },
        { heading: 'Mortar Mix for Type N (1:1:6)', text: 'Mortar volume: 480 bricks x 0.020 cu ft = 9.6 cu ft + 15% waste = 11.0 cu ft / 27 = 0.41 cu yd. For 1:1:6 (8 parts): cement = 0.41 / 8 x 2,700 / 94 = 1.47 bags (round to 2 bags). Lime = 0.41 / 8 x 2,000 / 50 = 2.05 bags (round to 2 bags). Sand = 0.41 / 8 x 6 x 27 = 8.3 cu ft.' },
        { heading: 'Batch Mixing Sequence', text: 'Mix 1 bag cement + 1 bag lime + 4.15 cu ft sand. Add 4-5 gallons water. Mix for 5 minutes in a mortar mixer. Mortar must be used within 2.5 hours at 75 degree F. For this wall, two batches are needed.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Mortar Mix Calculator',
      content: 'Mortar workability and long-term durability depend on more than just proportions. Sand gradation, lime plasticity, and hydration timing all affect the final result.',
      subsections: [
        { heading: 'Use Masonry Sand, Not Concrete Sand', text: 'Masonry sand has a finer gradation (passing #4 sieve, 95% passing #16 sieve), giving better workability and water retention. Concrete sand is coarser and produces stiff, difficult-to-spread mortar. Using concrete sand adds 25% more water demand and reduces bond strength by 15%.' },
        { heading: 'Adjust for Air Temperature', text: 'At 95 degree F, mortar hydration accelerates - usable life drops from 2.5 hours to 1 hour. Use Type N mortar with 50 degree F mixing water and keep mortar boards shaded. At 40 degree F, use Type III cement or add an accelerator (1-2% calcium chloride by cement weight).' },
        { heading: 'Match Joint Thickness to Block Tolerance', text: 'Standard 8-in concrete blocks vary in height by +/- 1/16 in. A 3/8-in joint absorbs block size variation. If blocks are precision-ground (+/- 1/32 in), a 1/4-in joint is sufficient. The calculator typically assumes 3/8-in; adjust for thinner joints by reducing mortar volume by 33%.' },
        { heading: 'Never Retemper Mortar After 2 Hours', text: 'Adding water to mortar that has begun to set raises the water-cement ratio and reduces compressive strength by up to 40%. Discard mortar older than 2.5 hours (1.5 hours in hot weather).' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Mortar Mix Calculators',
      content: 'Common questions involve mortar color additives, lime substitution, and compatibility with historic brick.',
      subsections: [
        { heading: 'How many bricks can I lay per bag of cement?', text: 'With Type N mortar (1:1:6), one 94-lb bag of cement yields about 380-400 bricks at 3/8-in joints. For Type S (1:0.5:4.5), about 340-360 bricks per bag. For 8-in blocks, one bag of cement yields about 50-55 blocks with Type S mortar.' },
        { heading: 'Can I use lime putty instead of hydrated lime?', text: 'Yes, and it is preferred for historic restoration. Lime putty (soaked for 2+ weeks) increases plasticity and self-healing properties. Use 2 parts lime putty to 1 part cement by volume for Type N equivalent.' },
        { heading: 'What mortar type should I use for stone veneer?', text: 'Use Type N (1:1:6) for adhered stone veneer on walls. For manufactured stone (weighing 15-20 lb/sq ft), the mortar must also serve as the adhesive. Apply a scratch coat with 1:1 Type S mortar, let cure 24 hours, then apply stone with Type N.' },
        { heading: 'How do I color mortar consistently?', text: 'Use iron-oxide pigments (red, buff, black, brown) at 2-5% by cement weight. With 2 bags of cement (188 lb), add 3.8-9.4 lb of pigment. Mix all dry ingredients thoroughly before adding water.' },
      ],
    },
  ],

  'wood-volume-calculator': [
    {
      title: 'What Is a Wood Volume Calculator and Why Does It Matter?',
      content: 'A wood volume calculator computes the board feet total for rough or surfaced lumber based on thickness, width, and length. One board foot is 1 inch thick x 12 inches wide x 12 inches long (144 cubic inches). In the US, hardwood lumber is sold by the board foot, while softwood is sold by the linear foot. A miscalculation of 10% on a 1,000-board-foot order of white oak at $6.50/bf means a $650 error in material cost - enough to bust a furniture builder\'s project budget.',
      subsections: [
        { heading: 'Why Board Foot Calculation Matters', text: 'A dining table requiring 300 board feet of walnut at $12/bf costs $3,600 in lumber alone. An extra 15% waste allowance pushes it to 345 board feet ($4,140). Accurate calculation prevents over-ordering (wasted money) or under-ordering (delays while sourcing more of a matching batch).' },
        { heading: 'Who Uses Wood Volume Calculators', text: 'Cabinetmakers, furniture builders, timber framers, flooring contractors, and DIY woodworkers all calculate board feet. A typical kitchen cabinet set uses 400-600 board feet of plywood and solid lumber combined.' },
        { heading: 'Key Outputs', text: 'Board feet (BF) total, board feet per piece, total linear feet, volume in cubic feet, estimated weight based on species density, and cost estimation.' },
      ],
    },
    {
      title: 'How a Wood Volume Calculator Works Step by Step',
      content: 'The calculator multiplies the thickness (in inches) by the width (in inches) by the length (in feet) and divides by 12 to get board feet for each piece, then sums all pieces. It handles surfaced lumber (S4S) allowances (surfaced 3/4 in actually starts at 13/16-7/8 in rough) and accounts for waste factors (15-30% for furniture, 5-10% for framing).',
      subsections: [
        { heading: 'Basic Board Foot Formula', text: 'Board feet = (T in x W in x L ft) / 12. A 2x4 that is actually 1.5 in x 3.5 in x 8 ft: (1.5 x 3.5 x 8) / 12 = 42 / 12 = 3.5 BF. For rough lumber: 4/4 (1 in thick) x 6 in wide x 10 ft: (1 x 6 x 10) / 12 = 5 BF.' },
        { heading: 'Handling Surfaced Lumber Loss', text: 'A 4/4 rough board (1.00 in) surfaces to 13/16 in (0.8125 in) S2S. If the project needs 0.75 in finished thickness, calculate the rough dimension by adding the surfacing loss. Calculator also accounts for kerf loss: a 14-in bandsaw blade removes 0.095 in per cut.' },
        { heading: 'Weight Estimation by Species', text: 'Red oak weighs 3.75 lb/BF (44 lb/cu ft at 6% MC). White oak is 4.17 lb/BF. Hard maple is 4.17 lb/BF. Walnut is 3.50 lb/BF. A 300-BF walnut coffee table: 300 x 3.50 = 1,050 lb total. The calculator warns if the weight exceeds intended support capacity.' },
        { heading: 'Waste Factor Application', text: 'For a dimensioned furniture piece with known cut list, waste is 15-20%. For rough lumber requiring planing and jointing, waste is 25-30%. For a table needing 100 BF of surfaced material: rough order = 100 x 1.25 = 125 BF minimum.' },
      ],
    },
    {
      title: 'Real-World Example: Hardwood for a 6-Person Dining Table',
      content: 'A dining table 72 in x 40 in x 0.75 in thick with an apron and 4 legs. The species is white oak. Let\'s calculate board feet for the entire project including waste.',
      subsections: [
        { heading: 'Tabletop Material Calculation', text: 'Top: 72 in x 40 in x 0.75 in = 2,160 cu in / 144 = 15 BF net. But the top is glued up from 6-in wide boards: 40 in wide requires 7 boards (6-in each + 1-in waste from jointing). Rough 4/4 white oak surfaces to 13/16 in, planed to 3/4 in. Each 6-in-wide x 6-ft board: (1 x 6 x 6) / 12 = 3 BF. 7 boards x 3 BF = 21 BF.' },
        { heading: 'Apron, Legs, and Additional Parts', text: 'Apron: four sides totaling 208 linear inches of 2-in-wide x 6/4 (1.5-in) rough stock: (1.5 x 2 x 208) / 12 = 52 BF. Legs: four 4x4 x 28-in legs = (3.5 x 3.5 x 28) / 12 x 4 = 114 BF. Breadboard ends and braces: 25 BF. Total net: 21 + 52 + 114 + 25 = 212 BF.' },
        { heading: 'Final Order with Waste', text: 'Furniture waste factor 20%: 212 x 1.20 = 254 BF. At $8.50/BF for 4/4 white oak and $12.00/BF for 8/4 (for legs), average $9.50/BF. Total cost: 254 x $9.50 = $2,413.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Wood Volume Calculator',
      content: 'Lumber yields vary dramatically based on cut type, grade, and grain orientation. Using a calculator without understanding these variables leads to under-ordering or poor board selection.',
      subsections: [
        { heading: 'Always Order by Rough Board Feet', text: 'A board foot calculator for surfaced lumber overestimates usable wood. A 6-ft 4/4 board that is 6 in wide S4S was 7 in wide rough. The 6-in surfaced dimension is 85.7% of the rough width. Always start calculations from rough dimensions, then apply surfacing to get net yield.' },
        { heading: 'Choose the Right Grade for the Project', text: 'FAS (First and Select) yields 83.3% clear cuttings - ideal for tabletops. #1 Common yields 66-75% clear - better value for cabinet doors and panels at 30-40% lower cost. Select & Better (S&B) is a mixed grade that averages FAS yield at #1 Common price.' },
        { heading: 'Account for Grain Orientation in Waste', text: 'If the tabletop uses rift-sawn or quarter-sawn white oak (less than 30-degree ring angle), yield drops to 50-60% of the log. Cost is 2x flat-sawn. The calculator should include a cut-type multiplier: flat-sawn 1.0, rift-sawn 1.6, quarter-sawn 2.0.' },
        { heading: 'Moisture Content Adjustment', text: 'Lumber shrinks 4-8% from green to 6-8% MC (kiln-dried). A calculator that ignores MC will overestimate volume. At 6% MC, white oak has stabilized at 94% of its green volume. A table built with green lumber shrinks 2-3% across the 40-in width - a 1-in gap appears.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Wood Volume Calculators',
      content: 'Woodworkers new and experienced alike ask about plywood vs. solid lumber, metric conversion, and the impact of saw kerf on yield.',
      subsections: [
        { heading: 'How do I calculate plywood instead of board feet?', text: 'Plywood is sold in 4x8 sheets regardless of thickness. A 3/4-in sheet of Baltic birch (5 ft x 5 ft) is 25 sq ft. To convert to board feet: sheet thickness in inches x area sq ft. A 4x8 sheet of 1/2-in plywood: 0.5 x 32 = 16 BF. But plywood is priced per sheet ($50-$120/sheet), not per BF.' },
        { heading: 'What is the difference between BF and linear feet?', text: 'Linear feet measures length only. Dimensional lumber (2x4s, 2x6s) is sold by linear foot, typically $0.50-$2.00/LF depending on species. Hardwood lumber is sold by the board foot. A 2x4-10 ft is 10 linear feet = (1.5 x 3.5 x 10) / 12 = 4.375 BF.' },
        { heading: 'How many board feet are in a log?', text: 'Use the Doyle Log Rule: BF = ((D - 4)^2 x L) / 16, where D is the small-end diameter in inches and L is length in feet. A 16-in diameter, 10-ft log: ((16 - 4)^2 x 10) / 16 = (144 x 10) / 16 = 90 BF. Actual yield from milling is 60-70% of this scale.' },
        { heading: 'Can I return extra lumber?', text: 'Most hardwood dealers accept returns of undamaged, uncut boards within 30 days but charge a 15-25% restocking fee. Better to order 10% less and make a second trip than over-order.' },
      ],
    },
  ],

  'plywood-calculator': [
    {
      title: 'What Is a Plywood Calculator and Why Does It Matter?',
      content: 'A plywood calculator determines the exact number of full 4x8 sheets needed for a sheathing, roofing, or flooring project based on the total surface area, panel orientation, and waste allowance. It accounts for the actual panel coverage (48 sq ft per sheet but only 46-47 sq ft due to tongue-and-groove overlap or edge gaps). A miscalculation of one sheet may cost $55-$75 per sheet of CDX plywood, and three extra sheets on a 2,000-sq-ft roof add $180-$225 in unnecessary material plus disposal fees.',
      subsections: [
        { heading: 'Why Accurate Panel Count Matters', text: 'A 1,500 sq ft roof deck with 32-ft rafters and 4-ft overhang needs 1,500 / 32 sq ft per sheet (after accounting for 1/8-in gaps between panels) = 47 sheets if optimized for 4-ft module spacing. Guessing 50 sheets wastes $175 on a $55/sheet job.' },
        { heading: 'Who Uses a Plywood Calculator', text: 'Roofers sheathing new homes, siding contractors installing shear panels, flooring contractors laying subflooring, and DIY builders constructing sheds. A typical 2,000 sq ft house requires 65-70 sheets of sheathing.' },
        { heading: 'Key Outputs', text: 'Number of 4x8 sheets needed, total square footage, number of sheets for walls vs. roof, cut list for partial panels, and waste percentage.' },
      ],
    },
    {
      title: 'How a Plywood Calculator Works Step by Step',
      content: 'The calculator divides total wall or roof area by the coverage area of one sheet (typically 32 sq ft for 4x8, or 28-30 sq ft for metric sheets), then rounds up to the nearest full sheet. It adjusts for panel orientation (vertical vs. horizontal), edge gaps (1/8 in between panels), and adds 5-10% waste for cuts around windows, doors, and hips.',
      subsections: [
        { heading: 'Coverage Area Calculation', text: 'A 4x8 sheet is 48 sq ft gross. But with 1/8-in gaps on all sides, actual coverage per sheet is 47.75 in x 95.75 in / 144 = 31.8 sq ft. For a 40 ft x 30 ft roof deck: 1,200 sq ft / 31.8 = 37.7 sheets, rounding to 38 sheets.' },
        { heading: 'Panel Orientation Optimization', text: 'Vertical installation (8-ft sheets oriented vertically on 8-ft walls) wastes less. A 40-ft long wall with 8-ft height: 40 / 4 = 10 sheets per course. One course = 10 sheets. For 9-ft walls, horizontal installation with staggered joints uses fewer sheets.' },
        { heading: 'Waste Factor Application', text: 'For a gable roof, standard waste is 10-15% due to hips, valleys, and ridges. A 1,200 sq ft roof at 12% waste: 1,344 sq ft / 31.8 = 42.3 sheets (43 sheets). A simple shed roof with no valleys: 5% waste = 39.8 sheets (40 sheets).' },
        { heading: 'Subflooring Specifics', text: 'Tongue-and-groove (T&G) plywood for subfloors has a 1/4-in tongue that reduces inter-sheet gap, but the net coverage is still 31.9 sq ft per sheet. A 30 ft x 40 ft floor: 1,200 / 31.9 = 37.6 sheets (38 sheets). T&G also requires blocking under joints perpendicular to joists.' },
      ],
    },
    {
      title: 'Real-World Example: Sheathing a 2,000 Sq Ft House',
      content: 'A 2,000 sq ft two-story house with a 26-ft x 40-ft footprint. Walls are 9 ft tall. Let\'s calculate the plywood needed for wall sheathing, roof sheathing, and subfloor.',
      subsections: [
        { heading: 'Wall Sheathing Calculation', text: 'Total wall area: perimeter (26+40+26+40) = 132 ft x 9 ft = 1,188 sq ft. Subtract 200 sq ft for windows and doors = 988 sq ft net. At 31.8 sq ft per sheet: 988 / 31.8 = 31.1 sheets (32 sheets). Add 5% for waste = 34 sheets of 7/16-in OSB at $22/sheet = $748.' },
        { heading: 'Roof Sheathing', text: '26 ft x 40 ft roof with 6/12 pitch (roof factor 1.118): roof area = 26 x 40 x 1.118 = 1,163 sq ft per side = 2,326 sq ft total. At 31.8 sq ft/sheet: 2,326 / 31.8 = 73.1 sheets. Add 12% waste for hips and ridges: 82 sheets of 1/2-in CDX at $35/sheet = $2,870.' },
        { heading: 'Subfloor Requirements', text: 'Floor area: 26 x 40 = 1,040 sq ft per floor (two floors = 2,080 sq ft). At 31.9 sq ft/sheet (T&G): 2,080 / 31.9 = 65.2 sheets. Add 10% waste: 72 sheets of 3/4-in T&G OSB at $55/sheet = $3,960. Total plywood for the house: 34 + 82 + 72 = 188 sheets at $7,578 total.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Plywood Calculator',
      content: 'Getting the sheet count right is only half the battle. Panel thickness, grade, and code-required nailing patterns also affect quantity and cost.',
      subsections: [
        { heading: 'Match Thickness to Span Rating', text: 'Sheathing must meet IRC span ratings. 7/16-in OSB is rated for 16-in OC rafter spacing. 1/2-in CDX is rated for 24-in OC. 3/4-in T&G subfloor is rated for 24-in OC joists. Using 7/16-in on 24-in OC rafters causes 1/2-in deflection under load - a code violation.' },
        { heading: 'Account for Wall Bracing Requirements', text: 'IRC 2025 requires braced wall panels every 25 ft. Plywood shear panels (3/8-in minimum) serve as both sheathing and bracing. A 4-ft-wide shear panel at each corner uses 2 extra sheets per wall.' },
        { heading: 'Optimize Cut Layout for Waste Reduction', text: 'A 4x8 sheet cut diagonally for gable ends yields two triangular pieces. For a 26-ft wide gable (13-ft half width), the gable height at 6/12 pitch = 13 x 6 / 12 = 6.5 ft. Each gable needs 3 sheets cut to triangular shapes.' },
        { heading: 'Factor in Code-Minimum Nailing', text: 'Panel edges require nails at 6-in OC, field at 12-in OC. For a 4x8 sheet: 2 edges x 6 ft x 12 nails/ft + field at 4 rows x 8 ft x 1 nail/ft = 144 + 32 = 176 nails per sheet. 188 sheets x 176 nails = 33,088 nails.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Plywood Calculators',
      content: 'Common questions involve OSB vs. plywood cost, exposure ratings, and whether to use metric sheets.',
      subsections: [
        { heading: 'How many 4x8 sheets do I need for a 12x12 shed?', text: 'A 12x12 shed with 8-ft walls: walls = 48 ft perimeter x 8 ft = 384 sq ft / 32 sq ft per sheet = 12 sheets. Roof with 24-ft overhang: 16 ft x 14 ft = 224 sq ft / 32 = 7 sheets. Subfloor: 12x12 = 144 sq ft / 32 = 5 sheets. Total: 24 sheets of various thicknesses.' },
        { heading: 'Is OSB or plywood better for sheathing?', text: 'OSB (7/16-in) costs $18-$25/sheet vs. CDX plywood $30-$40/sheet. OSB has 10% lower nail-holding strength but better dimensional stability. Plywood resists moisture better (OSB swells 15% at edges when wet).' },
        { heading: 'What edge spacing is required between sheets?', text: 'IRC requires 1/8-in gap between panels and 1/4-in gap at end joints for drainage and thermal expansion. Without these gaps, buckling occurs after rain or humidity changes.' },
        { heading: 'Can I use 5/8-in plywood for subfloor instead of 3/4-in?', text: '5/8-in plywood is rated for 16-in OC joist spacing with a maximum 30 lb/sq ft live load. 3/4-in is required for 24-in OC. For a kitchen with heavy appliances (40 lb/sq ft + point loads), 3/4-in T&G is the minimum.' },
      ],
    },
  ],

  'shower-tile-calculator': [
    {
      title: 'What Is a Shower Tile Calculator and Why Does It Matter?',
      content: 'A shower tile calculator computes the exact number of tiles needed for shower walls and floor based on the shower dimensions, tile size, grout joint width, and pattern layout. It accounts for the area of each wall individually (including the curb and niche), subtracts non-tiled areas (shower valve, showerhead), and adds a waste factor for cuts, breakage, and pattern matching. A miscalculation on a 3 ft x 4 ft shower with 12x24-in tiles could mean ordering 15% fewer tiles than needed, stopping a $6,000 tiling project mid-installation.',
      subsections: [
        { heading: 'Why Accurate Tile Quantity Matters', text: 'A 36 in x 48 in x 84 in shower has 106 sq ft of wall and floor area. With 12x24-in tiles and 1/8-in grout lines, the calculator estimates 53 tiles net plus 15% waste = 61 tiles. Ordering only 53 tiles leaves 8 tiles short - special orders take 2-3 weeks and matching dye lots is impossible.' },
        { heading: 'Who Uses a Shower Tile Calculator', text: 'Bathroom remodelers, tile contractors, interior designers, and DIY homeowners. A typical shower remodel costs $3,000-$8,000, with tile making up $800-$2,500 of the budget.' },
        { heading: 'Key Outputs', text: 'Number of tiles per wall, total tiles, total sq ft, boxes needed (12 tiles/box typical), linear ft of tile edge trim, grout quantity (lb), and thinset mortar quantity (lb).' },
      ],
    },
    {
      title: 'How a Shower Tile Calculator Works Step by Step',
      content: 'The calculator measures each wall\'s width and height (accounting for the shower pan slope if tilting the floor), multiplies to get area, divides by the tile size in sq ft, adjusts for grout line reduction, then applies the waste factor. For diagonal or herringbone patterns, waste increases from 10% to 20% due to edge cuts.',
      subsections: [
        { heading: 'Wall Area Calculation', text: 'Back wall: 48 in wide x 84 in tall = 4,032 sq in / 144 = 28.0 sq ft. Side wall 1: 36 in x 84 in = 3,024 sq in = 21.0 sq ft. Side wall 2: same, 21.0 sq ft. Floor: 36 in x 48 in = 1,728 sq in = 12.0 sq ft. Total: 82 sq ft net. Subtract 0.5 sq ft for the valve + 0.3 sq ft for showerhead = 81.2 sq ft.' },
        { heading: 'Tile Count with Grout Adjustment', text: '12x24-in tile = 2.0 sq ft each. With 1/8-in grout, actual tile plus grout coverage = 12.125 in x 24.125 in = 292.5 sq in / 144 = 2.03 sq ft/tile. Net tiles needed: 81.2 / 2.03 = 40.0 tiles. Add 15% waste: 40 x 1.15 = 46 tiles. At 12 tiles per box: 46 / 12 = 3.83 boxes, round to 4 boxes (48 tiles).' },
        { heading: 'Grout Quantity Estimate', text: 'Tile area 81.2 sq ft with 12x24-in tiles and 1/8-in grout. Grout volume = (tile perimeter x joint width x depth) / 2. Each tile perimeter = 72 in. 40 tiles x 72 in = 2,880 in of joint / 2 = 1,440 in of grout line. 1,440 x 0.125 in x 0.375 in = 67.5 cu in / 1,728 = 0.039 cu ft = about 6 lb of unsanded grout.' },
        { heading: 'Thinset Calculation', text: 'A 3/8-in square-notched trowel uses 0.6 lb/sq ft of thinset. 81.2 sq ft x 0.6 = 48.7 lb. Thinset comes in 50-lb bags, so 1 bag. For floors on top of a Schluter-Kerdi membrane, use unmodified thinset at 0.7 lb/sq ft.' },
      ],
    },
    {
      title: 'Real-World Example: Tiling a 36 in x 48 in Shower',
      content: 'A master bathroom shower measures 36 in wide x 48 in deep x 84 in high. Tile choice is 12x24-in porcelain with 1/16-in grout joints, installed vertically (stack bond) on walls and a 2x2-in mosaic hex floor tile.',
      subsections: [
        { heading: 'Walls and Floor Tile Count', text: 'Wall area: 81.2 sq ft. 12x24-in tile area with 1/16-in grout = 12.0625 x 24.0625 = 290.3 sq in / 144 = 2.016 sq ft. Net tiles: 81.2 / 2.016 = 40.3 tiles. With 15% waste: 46.3 (47 tiles). Floor: 12 sq ft. 2x2-in hex sheets (12x12-in sheet = 1 sq ft): 12 sheets + 15% waste = 14 sheets.' },
        { heading: 'Trim and Accent Pieces', text: 'Shower niche (12 in x 18 in) requires 2 tiles cut to size, plus Schluter edging: 12 + 18 + 12 + 18 = 60 linear inches of Jolly trim. Curb: 48-in-long x 4.5-in-tall, 1.5 sq ft = 2 tiles. Top of curb needs quarter-round bullnose.' },
        { heading: 'Mortar and Waterproofing', text: 'Schluter Kerdi membrane (54-in wide) for walls: 5 ft x 10 ft roll = 50 sq ft covers walls. Kerdi-band (5 in x 50 ft) for seams. Thinset: 2 bags (50 lb each) of unmodified thinset - one for membrane, one for tile.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Shower Tile Calculator',
      content: 'Installation success depends on more than tile count. Layout planning, pattern selection, and substrate preparation all affect the final tile quantity and installation difficulty.',
      subsections: [
        { heading: 'Add Extra Waste for Large-Format Tile', text: 'Tiles 12x24 in and larger require 20% waste due to additional cuts around niches, valves, and corners. Unlike standard wall tiles (10% waste), large-format tiles can\'t be cut incrementally - a mistake means tossing the whole tile at $12-$25 each.' },
        { heading: 'Subtract Grout Line from Tile Coverage', text: 'With 1/16-in grout joints, each 12x24-in tile covers 2.01 sq ft. With 1/8-in joints, coverage drops to 2.03 sq ft - counterintuitive but the grout space adds slightly. For mosaic floor sheets, actual coverage is 0.95 sq ft per sheet.' },
        { heading: 'Plan for Pattern Repeat', text: 'Herringbone pattern uses tiles at 45 degrees - each pattern repeat requires 2 tiles (one angled left, one right). Extra 10% waste for pattern matching = 1.5 more boxes of tile.' },
        { heading: 'Always Round Up to Full Boxes', text: '12x24 porcelain tiles come 12 per box (24 sq ft). Need 47 tiles? That\'s 3.92 boxes - buy 4 boxes (48 tiles). You will use 1-2 for future repairs. Tile dye lots vary; the next batch 3 months later may be 2% off in color.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Shower Tile Calculators',
      content: 'Common questions involve subway tile layout, niche tiling, and the best thinset for wet areas.',
      subsections: [
        { heading: 'How much extra tile should I buy for a shower?', text: 'For walls with 12x24-in tile in a standard layout: 15% waste. For diagonal (herringbone, diamond): 20%. For mosaic sheets on shower floor: 15%. Buy one spare box for future repairs if the tile will be discontinued.' },
        { heading: 'How do I tile a shower niche?', text: 'A 12x18-in niche needs a back piece (12x18-in) cut from a whole tile (or choose a contrasting tile). Side and top strips: cut 12x24 into 12x12 pieces, then rip each to 2-in wide strips.' },
        { heading: 'What size trowel for 12x24 tile?', text: 'Use a 1/2-in x 1/2-in square-notch trowel for large-format tile to achieve 95% coverage minimum (TCNA requirement). A 3/8-in trowel provides 80% coverage, leading to lippage and hollow spots.' },
        { heading: 'Can I tile over existing tile?', text: 'Yes, if the existing tile is sound, clean, and not glazed. Use a primer like Mapei Eco Prim Grip at $40/gallon. The calculator should add 1/2-in to wall depth to maintain plumbing rough-in depth.' },
      ],
    },
  ],

  'vinyl-flooring-calculator': [
    {
      title: 'What Is a Vinyl Flooring Calculator and Why Does It Matter?',
      content: 'A vinyl flooring calculator determines the total square footage of flooring needed for a room or entire house, translating it into boxes of planks or sheets required. It accounts for room dimensions (including closets and alcoves), plank orientation, underlayment requirements, and adds a waste factor specific to the installation method (10% for glue-down, 15% for floating click-lock, 20% for diagonal patterns). A miscalculation on a 500 sq ft basement could mean ordering 550 sq ft instead of 575, coming up 1.5 boxes short and delaying the project by a week.',
      subsections: [
        { heading: 'Why Accurate Vinyl Quantity Matters', text: 'Vinyl plank flooring costs $3.50-$8.00/sq ft installed. A 500 sq ft room at $5/sq ft = $2,500. An underestimation of 10% (= 50 sq ft = $250) means a special order delay of 5-10 days, during which the room is unusable.' },
        { heading: 'Who Uses a Vinyl Flooring Calculator', text: 'Homeowners finishing basements, contractors flipping houses, interior designers specifying luxury vinyl tile (LVT), and DIY installers. Luxury vinyl plank (LVP) has surpassed hardwood in U.S. sales since 2023, with 1.8 billion sq ft sold in 2024.' },
        { heading: 'Key Outputs', text: 'Total sq ft needed, number of boxes (sq ft per box varies: typically 20-24 sq ft), number of planks, linear ft of transition strips, underlayment rolls, and adhesive gallons (for glue-down).' },
      ],
    },
    {
      title: 'How a Vinyl Flooring Calculator Works Step by Step',
      content: 'The calculator multiplies room length by width for rectangular areas and adds separate calculations for closets, alcoves, and irregular shapes. It sums the total, multiplies by the waste factor based on installation method and room geometry, then divides by the box coverage to get the number of boxes needed (always rounding up).',
      subsections: [
        { heading: 'Base Square Footage Calculation', text: 'A 20 ft x 15 ft living room: 300 sq ft. Add a 4 ft x 6 ft closet: 24 sq ft. Add a 3 ft x 4 ft entry alcove: 12 sq ft. Gross area: 336 sq ft. For a rectangular room with no patterns, waste factor = 10%. Total: 336 x 1.10 = 369.6 sq ft.' },
        { heading: 'Box Count and Plank Quantity', text: 'Each box of LVP covers 22.5 sq ft. 369.6 / 22.5 = 16.43 boxes, round up to 17 boxes (382.5 sq ft). At 8 planks per box (typical 7-in x 48-in planks): 17 x 8 = 136 planks.' },
        { heading: 'Waste Factor by Installation Type', text: 'Floating click-lock with planks staggered: 10% for rooms under 200 sq ft, 8% for 200-500 sq ft, 5% for over 500 sq ft (fewer partial rows). Add 3% for rooms with more than 4 corners or 1/2-in irregularities in wall straightness.' },
        { heading: 'Underlayment and Accessories', text: 'Floating LVP requires 2-mm foam underlayment (18 sq ft per 4-ft-wide x 50-ft roll = 200 sq ft). 369.6 sq ft / 200 = 1.85 rolls, round to 2 rolls. Transition strips: doorways (2 per room), T-moldings for adjacent flooring, and quarter-round for baseboards.' },
      ],
    },
    {
      title: 'Real-World Example: Vinyl Plank Flooring for a 1,200 Sq Ft Basement',
      content: 'A finished basement has a 30 ft x 30 ft main room, a 8 ft x 10 ft storage room, and a 5 ft x 5 ft bathroom. The owner chooses 7-in x 48-in LVP with a floating click-lock system.',
      subsections: [
        { heading: 'Area and Waste Calculation', text: 'Main room: 900 sq ft. Storage: 80 sq ft. Bathroom: 25 sq ft. Total: 1,005 sq ft. Basement with multiple rooms and corners: 12% waste. Total: 1,005 x 1.12 = 1,125.6 sq ft. Boxes (22.5 sq ft each): 1,125.6 / 22.5 = 50.03 boxes, round to 51 boxes (1,147.5 sq ft).' },
        { heading: 'Underlayment and Moisture Barrier', text: 'Basement requires 6-mil polyethylene vapor barrier under the underlayment. Roll size: 10 ft x 100 ft (1,000 sq ft). 1,005 sq ft / 1,000 = 1.01 rolls, round to 2 rolls (tape seams). 2-mm underlayment: 4 ft x 50 ft rolls cover 200 sq ft each.' },
        { heading: 'Trim and Transition Quantities', text: 'Room perimeter: main room = 120 LF, storage = 36 LF, bath = 20 LF. Total 176 LF of quarter-round or base shoe. Doorways: 3 doors at 36 in each = 9 ft of T-molding transitions. Total accessory cost: approximately $280.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Vinyl Flooring Calculator',
      content: 'Vinyl plank installation has specific preparation requirements that affect material quantity. Subfloor condition, plank width, and layout direction all influence the final number.',
      subsections: [
        { heading: 'Add 5% for Diagonal or Herringbone Layout', text: 'Installing planks diagonally (45 degrees) or in a herringbone pattern increases edge cuts by 40%. A 1,200 sq ft basement with diagonal LVP needs 1,200 x 1.17 = 1,404 sq ft (62 boxes vs. 51 for standard).' },
        { heading: 'Check Subfloor Flatness First', text: 'Vinyl requires a subfloor flatness of 3/16 in in 10 ft. An uneven subfloor requires self-leveling compound at $30-$50 per 50-lb bag (covers 50 sq ft at 1/8-in depth). For a 1,005 sq ft basement with 1/4-in average deviation: 21 bags x $40 = $840.' },
        { heading: 'Match Box Lot Numbers', text: 'Order all boxes from the same production lot. Dye lot variation of even 0.5% is visible across a large room under continuous lighting. A 51-box order should have all boxes stamped with the same 6-digit lot code.' },
        { heading: 'Account for Expansion Gaps', text: 'Floating vinyl needs a 1/4-in expansion gap around the perimeter. For a 30 ft x 30 ft room, the total gap area is (60 ft + 60 ft) x 0.25 in / 12 = 2.5 sq ft. Baseboards must be removed and replaced with taller ones to cover the gap.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Vinyl Flooring Calculators',
      content: 'DIYers and contractors ask about LVP vs. sheet vinyl, moisture mitigation, and floating vs. glue-down choice.',
      subsections: [
        { heading: 'What is the difference between LVP and sheet vinyl?', text: 'LVP (luxury vinyl plank) is a rigid or semi-flexible plank with a click-lock edge, installed as a floating floor. Sheet vinyl comes in 6-ft or 12-ft wide rolls, glued down full-spread. Sheet vinyl has 5% waste vs. 10% for LVP.' },
        { heading: 'How do I measure for sheet vinyl?', text: 'Measure the widest and longest points of the room, add 6 in of overlap at each side for trimming. Sheet vinyl is 12 ft wide by default. A 15 ft x 20 ft room: order a 12 ft x 21 ft piece (252 sq ft) and a 3 ft x 21 ft piece (63 sq ft) seamed.' },
        { heading: 'Can LVP be installed over concrete?', text: 'Yes, but concrete moisture must be below 85% RH per ASTM F2170. Test with a calcium chloride test: moisture emission rate must be below 3 lb/1,000 sq ft/24 hours. High moisture requires epoxy moisture mitigation ($1.50-$3.00/sq ft).' },
        { heading: 'How long does vinyl flooring take to acclimate?', text: 'LVP requires 48 hours of acclimation in the installation room at 65-85 degree F and 35-65% RH. Open all boxes and stack planks flat, not on edge.' },
      ],
    },
  ],

  'pergola-calculator': [
    {
      title: 'What Is a Pergola Calculator and Why Does It Matter?',
      content: 'A pergola calculator estimates the quantity and dimensions of lumber, posts, rafters, beams, and hardware needed to build a freestanding or attached pergola. It accounts for the deck or patio size, desired roof pitch, post spacing, rafter spacing, and local snow/wind loads. A miscalculated beam span on a 12 ft x 16 ft pergola could mean 2x8 beams that sag 0.75 in under their own weight, turning a elegant backyard structure into a code-violating hazard within a year.',
      subsections: [
        { heading: 'Why Accurate Pergola Sizing Matters', text: 'A 12 ft x 16 ft pergola with 6x6 posts (actual 5.5x5.5 in) at 8 ft OC and 2x8 beams (1.5x7.25 in) spanning 12 ft deflects 0.5 in under dead load only. Code limits deflection to L/240 = 12x12/240 = 0.6 in. Adding snow load at 20 psf exceeds deflection limits by 30%.' },
        { heading: 'Who Uses a Pergola Calculator', text: 'Homeowners designing backyard living spaces, general contractors building deck additions, and landscape architects. A typical 12 ft x 14 ft pergola costs $2,500-$5,000 in materials in 2025.' },
        { heading: 'Key Outputs', text: 'Number and size of posts (4x4 or 6x6), beam spans and sizes, rafter count and spacing, lath/batten quantity, hardware (post bases, brackets, screws), and concrete for footings.' },
      ],
    },
    {
      title: 'How a Pergola Calculator Works Step by Step',
      content: 'The calculator lays out the pergola footprint based on user dimensions, spaces posts evenly along the perimeter (max 8-10 ft OC for 6x6 posts), calculates beam spans with live load deflection checks, then distributes rafters at 16-24 in OC perpendicular to the beams.',
      subsections: [
        { heading: 'Post Layout and Footing Design', text: 'A 12 ft x 16 ft pergola with posts at 8 ft OC on the long side and 6 ft OC on the short side: 6 posts total (2 per 16-ft side + corners). Each post sits on a 12-in-diameter x 24-in-deep concrete footing (3.14 x 0.5^2 x 2 = 1.57 cu ft x 6 = 9.42 cu ft / 27 = 0.35 cu yd of concrete per post).' },
        { heading: 'Beam Sizing and Span Check', text: 'Side beams span 16 ft between posts. With 6x6 posts at 8 ft OC, each beam is continuous over 3 supports. For a 20 psf snow load + 10 psf dead load = 30 psf total. Each beam carries tributary width = 6 ft. Load per linear ft = 30 psf x 6 ft = 180 plf.' },
        { heading: 'Rafter and Lath Calculation', text: 'Rafters span the 12-ft width perpendicular to beams. At 24 in OC, 14 ft length of rafters need (12 ft x 12 in/ft / 24 in) + 1 = 7 rafters. Each rafter: 2x8 x 14 ft. Total rafter lumber: 7 x 14 = 98 linear ft. Lath (2x2 or 2x4) runs perpendicular at 12 in OC.' },
        { heading: 'Hardware and Fastener Count', text: 'Post bases: 6 Simpson ABA44Z. Post-to-beam connectors: 6 Simpson LPC4Z. Beam-to-rafter hurricane ties: 7 Simpson H2.5A. Fasteners: 3-in #10 stainless steel deck screws at 12 in OC along each rafter-to-beam connection.' },
      ],
    },
    {
      title: 'Real-World Example: Attached Pergola for a 12 ft x 14 ft Deck',
      content: 'A homeowner wants a 12 ft x 14 ft attached pergola extending from the house. The house ledger board supports one side; two rows of posts support the outer edge. Roof pitch is 2:12 for drainage.',
      subsections: [
        { heading: 'Ledger and Post Layout', text: 'Ledger: 14-ft long 2x10 bolted to the house rim joist with 1/2-in x 8-in stainless steel lag bolts at 16 in OC (11 bolts). Two posts: one at each corner of the 14-ft side, both 6x6 set 2 ft from the house. Post height varies: 96 in (short side) + 12-ft width x 2/12 slope = 96 + 24 = 120 in.' },
        { heading: 'Beam and Rafter Sizing', text: 'Outer beam: 14-ft single span with 6x6 posts at 0 and 14 ft. Beam: double 2x10 (1.5x9.25 in x 2) for 14 ft span. Rafters: 2x8 at 16 in OC spanning 12 ft + 1 ft overhang = 13 ft each. Width 14 ft x 12 / 16 = 10.5, rounded to 11 rafters.' },
        { heading: 'Footing Concrete and Shade Coverage', text: 'Two footings: each 18-in diameter x 24-in deep = 3.14 x 0.75^2 x 2 = 3.53 cu ft x 2 = 7.06 cu ft / 27 = 0.26 cu yd. Use 6 bags of 80-lb Quikrete per footing (12 total). Shade coverage: 2x4 lath at 6 in OC over the 12 ft x 14 ft area.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Pergola Calculator',
      content: 'Pergola material choices and local building codes significantly affect calculations. Wood type, hardware corrosion resistance, and wind uplift must be factored in for a durable structure.',
      subsections: [
        { heading: 'Use No. 1 Grade Lumber for Visible Structure', text: 'No. 2 or better (common) lumber has knots up to 2-in diameter that weaken bending strength by 15-20%. For a pergola with visible beams and rafters, use No. 1 grade (knots under 1 in) or select structural. Cost: 20-30% more but reduces sag risk.' },
        { heading: 'Check Local Wind Uplift Requirements', text: 'Hurricane ties (Simpson H2.5A) are rated for 425 lb uplift. In regions with 110 mph wind (coastal FL, TX), uplift on a 12x14 pergola with 2x8 rafters at 16 in OC can exceed 500 lb per connection. Use H2.5A and add 1/2-in through-bolts with washers.' },
        { heading: 'Account for Post Bracing in Seismic Zones', text: 'In seismic zones D and E, posts require diagonal bracing. For 6x6 posts over 8 ft tall, add 2x6 knee braces at 45 degrees from post to beam. Each brace is cut at 45 degrees: length = 24 in (rise) x 1.414 = 34 in.' },
        { heading: 'Design for Drainage on the Ledger', text: 'The house-side ledger requires 1/2-in standoff from the sheathing to allow drainage behind the ledger. Use Simpson LSL ledger standoffs ($2 each) at 16 in OC. Without standoffs, water trapped behind the ledger rots the rim joist within 5-7 years.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Pergola Calculators',
      content: 'Common pergola questions address roof options (shade vs. solid), mounting to deck vs. ground, and required permits.',
      subsections: [
        { heading: 'Can I put a solid roof on a pergola?', text: 'Yes, but framing must be upgraded. A solid roof with asphalt shingles adds 15 psf (dead load) plus 20-40 psf (snow load). Rafters would increase from 2x8 to 2x12 or engineered trusses, and posts from 6x6 to 8x8. Most jurisdictions require a structural engineer stamp.' },
        { heading: 'How deep do pergola footings need to be?', text: 'Footings must extend below the frost line (typically 36-48 in in northern climates) or use a frost-protected shallow foundation (12 in with 2-in rigid foam insulation). For frost-free zones, 12-in diameter x 24-in deep piers are sufficient for 6x6 posts.' },
        { heading: 'What is the maximum span for 2x8 rafters?', text: 'At 16 in OC with 20 psf snow load + 10 psf dead load: 2x8 No. 2 Douglas fir spans a maximum of 10 ft 9 in. At 24 in OC: 9 ft 4 in. For the 12-ft span, use 2x10 at 16 in OC (max span 13 ft 1 in) or 2x12 at 24 in OC.' },
        { heading: 'Should I build attached or freestanding?', text: 'Attached pergolas anchor directly to the house ledger, saving $800-$1,200 in posts and footings. Freestanding pergolas give layout flexibility (place anywhere in the yard) but need a minimum of 4 posts plus diagonal bracing.' },
      ],
    },
  ],

  'garage-size-calculator': [
    {
      title: 'What Is a Garage Size Calculator and Why Does It Matter?',
      content: 'A garage size calculator determines the optimal interior dimensions, door widths, and ceiling height for a garage based on vehicle sizes, storage needs, and workspace requirements. It accounts for vehicle length, width, and height (including roof racks), plus clearances for opening doors, walking around the vehicle, and accessing shelving or workbenches. The standard 20 ft x 20 ft two-car garage is actually too small for two full-size SUVs (each 16 ft long x 6.5 ft wide) - opening doors simultaneously damages adjacent panels.',
      subsections: [
        { heading: 'Why Proper Garage Dimensions Matter', text: 'A 20 ft x 20 ft garage (400 sq ft) accommodates two Ford F-150s (each 17.5 ft x 6.7 ft) but with only 4-in clearance between the side mirrors when doors are closed. Opening a door requires the adjacent car to be parked 3 ft away - impossible in this layout.' },
        { heading: 'Who Uses a Garage Size Calculator', text: 'Homeowners designing new construction, architects planning subdivisions, contractors building garages, and DIYers converting existing garages for workshops. A 2.5-car garage (24 ft x 24 ft) is the most popular size in 2025.' },
        { heading: 'Key Outputs', text: 'Minimum garage width and depth, recommended door size (8x7, 9x7, 16x7, 16x8), turning radius clearance, wall storage linear ft, and total sq ft.' },
      ],
    },
    {
      title: 'How a Garage Size Calculator Works Step by Step',
      content: 'The calculator sums the widths of all vehicles plus door-opening clearances (3 ft per vehicle side) and walking paths (3 ft), then determines the minimum width. For depth, it adds vehicle length plus 3 ft front clearance and 2 ft rear clearance. Ceiling height is determined by the tallest vehicle plus 2 ft for garage door tracks and opener clearance.',
      subsections: [
        { heading: 'Width Calculation for Multiple Vehicles', text: 'For two SUVs (78 in wide each = 6.5 ft): minimum width per vehicle = 6.5 ft + 3 ft door opening = 9.5 ft. Two vehicles: 19 ft. Add 3 ft walking space between them: 22 ft. Add 2 ft wall clearance each side: 26 ft total.' },
        { heading: 'Depth Calculation', text: 'A crew-cab F-150 is 19.4 ft long (233 in). Minimum depth = 19.4 ft + 3 ft front clearance + 2 ft rear clearance = 24.4 ft. Round to 25 ft minimum depth. For a compact sedan (15 ft): 15 + 3 + 2 = 20 ft depth.' },
        { heading: 'Ceiling Height and Door Clearance', text: 'A standard SUV is 72 in tall with roof rack (76 in). Garage door opening height = 7 ft (84 in). With opener and tracks, 1 ft is added above the door. Minimum ceiling height = 84 in + 12 in tracks + 6 in opener clearance = 102 in = 8.5 ft.' },
        { heading: 'Door Width Sizing', text: 'For a single vehicle: 8x7 ft door is the minimum. A 9x7 ft door is preferred (adds 12 in of mirror clearance). For two cars, a 16x7 ft double door or two 9x7 ft single doors. The calculator recommends two single doors (18 ft total opening) for flexibility.' },
      ],
    },
    {
      title: 'Real-World Example: 3-Car Garage for a Suburban Home',
      content: 'A family owns a Ford F-150 (19.4 ft x 6.7 ft), a Toyota RAV4 (15.1 ft x 6.1 ft), and a Honda Civic (15.2 ft x 5.9 ft). They also want a 6 ft x 3 ft workbench and wall shelving.',
      subsections: [
        { heading: 'Minimum Garage Width', text: 'F-150: 6.7 + 3 ft door swing = 9.7 ft. RAV4: 6.1 + 3 = 9.1 ft. Civic: 5.9 + 3 = 8.9 ft. Subtotal: 27.7 ft. Add 2 ft walking space between each: 31.7 ft. Add 2 ft end walls: 35.7 ft. Recommend: 36 ft wide x 26 ft deep (936 sq ft).' },
        { heading: 'Depth and Ceiling Requirements', text: 'F-150 is the longest vehicle at 19.4 ft. Minimum depth: 19.4 + 3 front + 2 rear = 24.4 ft = 25 ft. Add 1 ft for the workbench at the front wall: 26 ft depth. Ceiling: 10 ft for an optional four-post lift.' },
        { heading: 'Storage and Workspace Allocation', text: 'Wall shelving on side walls: 36 ft + 36 ft minus two 9-ft doors = 54 linear ft of 24-in-deep shelving. Workbench: 6 ft x 30-in-deep with a 1/2-in plywood top and pegboard above. Storage between workbench and Civic: 3 ft aisle.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Garage Size Calculator',
      content: 'The difference between a cramped garage and a functional one comes down to clearances, ceiling height, and door configuration.',
      subsections: [
        { heading: 'Always Plan for Future Vehicle Changes', text: 'Your next vehicle will likely be larger. The average SUV length increased by 8 in between 2015 and 2025. Build for the largest vehicle you might own - a 24-ft depth fits any production vehicle sold today, while 20 ft limits you to compacts.' },
        { heading: 'Consider Tandem Parking for Flexibility', text: 'A 36 ft x 26 ft garage can be arranged as two rows: two cars deep (36 ft wide) with the third in tandem behind one. Tandem parking gives 39 ft of depth for one bay - enough for a full-size truck with a 4-ft workbench in front.' },
        { heading: 'Oversize the Garage Door Rough Opening', text: 'A standard 9x7 ft garage door needs a rough opening 9 ft 1.5 in wide x 7 ft 1.5 in tall. If you might later buy a taller vehicle, frame the opening at 10x8 ft now, install a 9x7 ft door. Retrofitting costs $2,500-$4,000.' },
        { heading: 'Plan for EV Charging and Utility Space', text: 'A Level 2 EV charger draws 40-60 A. Plan a subpanel in the garage with 100 A capacity. The charger location should be within 8 ft of the driver-side front corner of each bay. Running conduit later is $6-$10/ft vs. $2/ft during construction.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Garage Size Calculators',
      content: 'Homeowners often ask about minimum sizes, turning radii, and whether a garage can double as a workshop.',
      subsections: [
        { heading: 'What is the smallest acceptable two-car garage?', text: 'The absolute minimum per building codes is 20 ft x 20 ft (400 sq ft), but this fits only two compact cars. For mid-size sedans, minimum is 22 ft x 22 ft (484 sq ft). For SUVs or trucks, minimum is 24 ft x 24 ft (576 sq ft).' },
        { heading: 'How much turning space does a car need inside?', text: 'A vehicle\'s turning radius is typically 35-42 ft for sedans and 44-48 ft for trucks. Inside the garage, you need at least 8 ft of clear space perpendicular to the vehicle to angle in/out.' },
        { heading: 'Can I fit a car lift in a standard garage?', text: 'A two-post car lift requires a 12-ft ceiling (minimum 10 ft for low-ceiling models). The garage door must be a high-lift track system. Most standard 9-ft ceilings cannot accommodate a lift.' },
        { heading: 'How much storage can I add without losing car space?', text: 'Ceiling-mounted racks (4x8 ft, 400-600 lb capacity) store seasonal items above the cars. Wall shelving (24 in deep) along side walls stores tools and bins without losing parking footprint.' },
      ],
    },
  ],

  'shed-calculator': [
    {
      title: 'What Is a Shed Calculator and Why Does It Matter?',
      content: 'A shed calculator estimates the complete material list for building a storage shed: lumber for the floor frame, wall studs, roof rafters, plywood sheathing, roofing, siding, doors, trim, fasteners, and concrete pier footings. It takes the shed\'s length, width, wall height, roof pitch, and desired features (window, loft, ramp) and outputs a bill of materials with optimized lumber lengths to minimize waste. A miscalculated stud count for a 10x12 shed can leave you 20 studs short - a $60 mistake that delays the build by a day.',
      subsections: [
        { heading: 'Why Accurate Material Estimation Matters', text: 'A 10x12 shed with a 4/12 pitch roof uses approximately 2,350 board feet of lumber and one square (100 sq ft) of asphalt shingles. Underestimating by 10% (235 BF) at $2.50/BF costs $587 in extra material plus a trip to the lumberyard.' },
        { heading: 'Who Uses a Shed Calculator', text: 'DIY homeowners building garden sheds, contractors erecting storage structures, and lumberyards pre-cutting material kits. The average 10x12 shed kit costs $4,000-$7,000, while building from plans costs $1,500-$3,500 in materials.' },
        { heading: 'Key Outputs', text: 'Number of studs (2x4 or 2x6), joists (2x6), rafters (2x6), plywood sheets (floor, walls, roof), roofing squares, siding sq ft, trim linear ft, concrete piers, and fastener counts.' },
      ],
    },
    {
      title: 'How a Shed Calculator Works Step by Step',
      content: 'The calculator breaks the shed into four structural systems - floor, walls, roof, and finish - and calculates each independently. It multiplies linear lengths for stud walls by using the wall perimeter (minus openings) and dividing by stud spacing (16 or 24 in OC), then adds top plates, bottom plates, and headers for doors and windows.',
      subsections: [
        { heading: 'Floor Frame Calculation', text: 'For a 10x12 shed: floor joists run the 10-ft direction at 16 in OC. 12 ft x 12 / 16 = 9 joists. Rim joists: 2x6 x 12 ft (2 pieces) + 2x6 x 10 ft (2 pieces). Floor sheathing: 12 ft x 10 ft = 120 sq ft / 32 sq ft per sheet = 3.75 sheets, round to 4 sheets of 3/4-in T&G plywood.' },
        { heading: 'Wall Framing Details', text: 'Perimeter: 10+12+10+12 = 44 ft. Studs at 16 in OC: 44 x 12 / 16 = 33 studs + 1 extra per corner (4) = 37 studs. Top plates (2): 44 x 2 = 88 linear ft of 2x4. Bottom plate: 44 linear ft. Door header: 2x6 x 4 ft. Window header (if adding): 2x6 x 4 ft.' },
        { heading: 'Roof Rafter and Sheathing', text: '4/12 pitch roof spanning 12 ft (6 ft half-span). Rafter length = sqrt(6^2 + 2^2) = sqrt(36 + 4) = 6.32 ft. Add 1 ft overhang each side: 8.32 ft per rafter. Rafters at 24 in OC over 12 ft: 7 rafters. Each: 2x6 x 8.5 ft. Roof sheathing: 14 ft x 10 ft (with overhangs) = 140 sq ft / 32 = 4.4 sheets, round to 5 sheets.' },
        { heading: 'Siding and Trim Materials', text: 'Wall area: 44 ft perimeter x 8 ft height = 352 sq ft. Subtract 20 sq ft door + 10 sq ft windows = 322 sq ft. Lap siding (8-in exposure) covers 8 sq ft per 12-ft plank. 322 / 8 = 41 planks x 12 ft each = 492 linear ft. Corner trim: 4 corners x 8 ft = 32 linear ft. Drip edge: 10 ft + 14 ft + 10 ft + 14 ft = 48 linear ft.' },
      ],
    },
    {
      title: 'Real-World Example: Building a 10x12 Garden Shed',
      content: 'A gardener needs a 10 ft x 12 ft x 8 ft tall shed with a 4/12 pitch roof, one 36-in wide door, one window, and a ramp. Let\'s calculate the complete material list using the shed calculator.',
      subsections: [
        { heading: 'Foundation and Floor Materials', text: '6 concrete pier blocks (8x8x16 in) at $6 each = $36. 4x6 skid beams: 2 pieces x 12 ft. Floor frame: 9 joists x 10 ft 2x6 + rim joists. Total 2x6: 130 linear ft. 3/4-in T&G plywood: 5 sheets at $55 each = $275. 3-in galvanized screws: 5 lb box at $18.' },
        { heading: 'Wall and Roof Lumber', text: '2x4 studs: 37 pieces x 8 ft = 296 linear ft at $2.50/8-ft stud = $92. 2x6 rafters: 7 pieces x 8.5 ft = 60 linear ft at $5.50/8-ft = $44. Ridge board: 1 x 2x8 x 12 ft = $12. 7/16-in OSB sheathing: 12 sheets at $22 = $264. Asphalt shingles: 2 squares at $35/sq = $70.' },
        { heading: 'Door, Hardware, and Finish', text: 'Pre-hung 36-in exterior door: $180. 2x4 window frame with polycarbonate: $40. T-111 siding (plywood panel): 10 sheets at $45 = $450. Drip edge: 48 linear ft at $1.50/ft = $72. Ridge vent: 12 ft at $2.50/ft = $30. Paint: 2 gallons exterior latex at $35/gal = $70. Total materials: approximately $2,400.' },
      ],
    },
    {
      title: 'Pro Tips for Using a Shed Calculator',
      content: 'Shed material estimation involves many interconnected variables. Optimizing lumber lengths, accounting for scrap, and choosing the right siding can save hundreds of dollars.',
      subsections: [
        { heading: 'Optimize Stud Lengths to Reduce Scrap', text: 'Standard studs are 92-5/8 in (actual) for 8-ft walls with plates. For an 8-ft wall, you need 92-5/8 in studs. Using 8-ft (96-in) studs means cutting 3-3/8 in off each one - 37 cuts = 125 in of waste. Order precut studs at the same price.' },
        { heading: 'Match Roof Pitch to Local Snow Load', text: 'In snow zones (northern US, mountains), use a 6/12 or 8/12 pitch to shed snow. At 4/12 pitch with 30 psf snow load, rafters must be 2x6 at 16 in OC. At 8/12 pitch, snow slides off naturally - 2x6 at 24 in OC works, saving 3 rafters.' },
        { heading: 'Account for Siding Overlap', text: 'Lap siding requires 1-in overlap per course. A 10-ft wall with 8-in exposure siding: 120 in / 8 in = 15 courses. Each course is 10 ft + 1-in overlap invisible = 10.08 ft. Order 15 x 10.08 = 151.2 linear ft per wall side, not 10 x 8 = 80 sq ft.' },
        { heading: 'Include Fastener Quantity', text: 'Each 4x8 sheet of sheathing needs 176 nails (6 in OC edges, 12 in OC field). 17 sheets x 176 = 2,992 nails. Buy a 5-lb box of 8d galvanized nails (about 360 nails/lb = 1,800 nails per box). Buy 2 boxes for $14 each.' },
      ],
    },
    {
      title: 'Frequently Asked Questions About Shed Calculators',
      content: 'Common questions involve foundation types, siding choices, and whether to build or buy a kit.',
      subsections: [
        { heading: 'Do I need a permit for a 10x12 shed?', text: 'Most municipalities require permits for sheds over 120 sq ft. A 10x12 shed (120 sq ft) is right at the threshold. Permit fees range from $50 to $200. Setback requirements typically mandate 5-10 ft from property lines.' },
        { heading: 'What is the best foundation for a shed?', text: 'For a 10x12 shed on level ground: 6 concrete pier blocks at 8x8x16 in on 5 in of compacted gravel. For unlevel ground: 4-in reinforced concrete slab on 4 in of gravel ($500-$700 in materials). Skid foundation (treated 4x6 beams) is cheapest at $100 in lumber.' },
        { heading: 'How much does it cost to build vs. buy a shed?', text: 'Building from scratch: $1,500-$3,500 in materials. A pre-cut kit: $3,000-$6,000. A fully assembled shed delivered: $5,000-$10,000. Building yourself saves 40-60% but takes 20-40 hours of labor.' },
        { heading: 'What siding is most cost-effective for a shed?', text: 'T-111 (plywood panel siding) costs $40-$50 per 4x8 sheet and is the cheapest option. LP SmartSide (engineered wood) costs $60-$80 per sheet but lasts 2x longer. Vinyl siding costs $200-$400 for a 10x12 shed installed.' },
      ],
    },
  ],

  'lumber-calculator': [
    {
      title: 'What Is a Lumber Calculator and Why Does It Matter?',
      content: 'A lumber calculator is an essential construction planning tool that estimates the quantity of dimensional lumber needed for framing, decking, and structural projects. It converts architectural measurements into board feet or piece counts, preventing costly over-ordering and project-delaying shortages. Accurate lumber takeoffs directly impact budget control, material waste reduction, and job site efficiency.',
      subsections: [
        { heading: 'The Role of Lumber in Residential Framing', text: 'Lumber forms the skeletal framework of most residential and light commercial structures. Wall studs, floor joists, rafters, and headers all require precise sizing and spacing. A typical 2,000-square-foot home uses roughly 15,000 board feet of lumber, making accurate estimation critical to both structural integrity and procurement budgeting.' },
        { heading: 'Common Lumber Dimensions and Grades', text: 'Standard framing lumber comes in nominal dimensions such as 2x4, 2x6, 2x8, 2x10, and 2x12, with actual measurements slightly smaller. Lumber grades range from Select Structural to No. 2 and Stud grade, each with different strength characteristics. A lumber calculator accounts for these variables to ensure code-compliant specifications.' },
      ],
    },
    {
      title: 'How the Lumber Calculator Works',
      content: 'The lumber calculator takes project dimensions and framing specifications to compute required board footage and piece counts. It applies established framing density rules and waste factors to deliver procurement-ready material lists. Users input wall lengths, heights, stud spacing, and number of openings to generate accurate estimates.',
      subsections: [
        { heading: 'Board Foot Calculation Formula', text: 'Board feet are calculated as (Thickness in inches x Width in inches x Length in feet) / 12. For example, a 2x4 that is 12 feet long equals 8 board feet: (2 x 4 x 12) / 12 = 8. The calculator sums all framing members to produce total board footage for the project.' },
        { heading: 'Stud Quantity Estimation', text: 'Stud count is derived by dividing wall length by on-center spacing, typically 16 or 24 inches. A 40-foot wall with 16-inch spacing requires 31 studs: (40 x 12) / 16 + 1 = 31. The calculator adds extra studs for corners, intersections, and openings automatically.' },
        { heading: 'Header and Beam Sizing', text: 'Headers above doors and windows must support the load above them. A lumber calculator references span tables to recommend appropriate header sizes based on opening width, building width, and snow load. For a 6-foot opening in a 24-foot-wide building, a doubled 2x10 header may be required.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'Consider a 1,500-square-foot ranch home with exterior walls totaling 160 linear feet and interior partition walls adding 200 linear feet. Using the lumber calculator with 16-inch on-center spacing produces a comprehensive material list for the framing package.',
      subsections: [
        { heading: 'Project Scenario', text: 'The home has 8-foot ceilings, 12 windows at 3x4 feet each, 3 exterior doors at 3x7 feet, and 8 interior doors at 2.5x7 feet. The lumber calculator processes these inputs to determine stud quantities, header sizes, and total board feet needed for walls alone.' },
        { heading: 'Results and Interpretation', text: 'The calculator outputs approximately 2,400 board feet for wall framing, including 530 studs, 12 window headers, 11 door headers, and corner posts. This represents roughly 16% of the total lumber package, with floor joists and roof trusses comprising the remainder.' },
        { heading: 'Cost and Material Planning', text: 'At current lumber prices of approximately $1.20 per board foot for spruce-pine-fir, the wall framing totals $2,880. Adding a 10% waste factor brings the order to 2,640 board feet at $3,168. The calculator helps the contractor order precisely, avoiding a 15-20% overage common with manual estimates.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Experienced framers rely on lumber calculators to streamline takeoffs and reduce material waste. Following established best practices ensures estimates align with actual job site conditions and local building codes.',
      subsections: [
        { heading: 'Always Include a Waste Factor', text: 'Add 8-12% waste to account for cutting errors, defective boards, and last-minute changes. A 10% waste factor on a $20,000 lumber package adds $2,000 but prevents costly mid-project runs to the lumber yard that can delay construction by days.' },
        { heading: 'Verify Local Building Code Requirements', text: 'Many jurisdictions require specific lumber grades, stud spacing, and header sizes that differ from standard tables. Check local amendments before relying on calculator outputs. For example, hurricane-prone areas may require 2x6 studs at 16-inch centers even when code minimum allows 2x4 at 24 inches.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about lumber estimation and using the lumber calculator effectively.',
      subsections: [
        { heading: 'What is the difference between nominal and actual lumber dimensions?', text: 'Nominal dimensions are the stated size before planing, such as 2x4, while actual dimensions are the finished size after surfacing. A nominal 2x4 measures 1.5 inches by 3.5 inches. The lumber calculator uses nominal sizes for consistency with industry pricing and supplier listings.' },
        { heading: 'How much does lumber typically cost per board foot?', text: 'Lumber prices vary by species, grade, and region. As of 2026, spruce-pine-fir ranges from $1.00 to $1.50 per board foot, while pressure-treated lumber runs $1.50 to $2.50 per board foot. The calculator helps compare costs across different material grades for budget optimization.' },
      ],
    },
  ],

  'nail-calculator': [
    {
      title: 'What Is a Nail Calculator and Why Does It Matter?',
      content: 'A nail calculator estimates the quantity and type of nails required for framing, sheathing, decking, and finishing work in construction projects. Proper nail selection and quantity planning prevent structural failures caused by under-nailing and eliminate waste from over-purchasing. Nail fasteners account for 3-5% of total material cost but are critical to structural integrity and building code compliance.',
      subsections: [
        { heading: 'Nail Types and Their Applications', text: 'Common nails are used for framing, box nails for light construction, finishing nails for trim work, and roofing nails for asphalt shingles. Each type has specific shank diameters, head sizes, and coating options. A 16d common nail measures 3.5 inches long and is standard for framing connections, while an 8d nail at 2.5 inches is typical for sheathing.' },
        { heading: 'Code-Required Nailing Schedules', text: 'Building codes specify minimum nailing patterns for structural connections, including nail spacing, edge distances, and penetration depth. The International Residential Code requires nails spaced 6 inches on center along panel edges and 12 inches in the field for wall sheathing. A nail calculator applies these schedules automatically.' },
      ],
    },
    {
      title: 'How the Nail Calculator Works',
      content: 'The nail calculator accepts project dimensions, material types, and connection details to compute total nail quantities by size and type. It references standardized nailing schedules from building codes and industry standards to generate accurate counts. Users specify sheathing area, framing member quantities, and fastener spacing.',
      subsections: [
        { heading: 'Nail Quantity Calculation Formula', text: 'Total nails are computed as (Surface area / Spacing area) plus edge fasteners. For 4x8 sheets of plywood sheathing nailed at 6 inches on center along edges and 12 inches in the field, each sheet requires approximately 60 nails. A 2,000-square-foot wall area with 63 sheets needs roughly 3,780 nails for sheathing alone.' },
        { heading: 'Framing Connection Nails', text: 'Each framing connection requires a specific number of nails. A typical stud-to-plate connection uses two 16d nails, while joist hangers require specialized hanger nails. For a house with 1,000 studs and each having two top-plate and one bottom-plate connection, the calculator counts 6,000 nails just for stud-to-plate connections.' },
        { heading: 'Fastener Weight Estimation', text: 'Nails are sold by weight or count, with approximately 70-100 16d nails per pound. A 50-pound box of 16d nails contains roughly 4,000 nails. The calculator converts piece counts to pounds to simplify ordering from suppliers who price fasteners by weight rather than quantity.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 2,200-square-foot two-story home requires accurate nailing estimates across multiple trades. Framing, sheathing, decking, roofing, and finishing each demand different nail types and quantities.',
      subsections: [
        { heading: 'Project Scenario', text: 'The structure has 400 linear feet of wall framing, 1,800 square feet of wall sheathing, 1,200 square feet of roof decking, and 60 squares of asphalt shingles. Each component uses different nails: 16d commons for framing, 8d for sheathing, 8d ring-shank for decking, and 1.25-inch roofing nails for shingles.' },
        { heading: 'Results and Interpretation', text: 'The calculator produces a total of approximately 28,000 nails: 10,000 framing nails, 5,700 sheathing nails, 3,800 decking nails, and 8,500 roofing nails. This translates to about 280 pounds of mixed nails at an estimated cost of $320, representing roughly 1.5% of the project framing budget.' },
        { heading: 'Cost and Material Planning', text: 'Ordering by the box rather than by the pound saves 10-15%. The calculator recommends 3 boxes of 16d framing nails (50 lbs each), 2 boxes of 8d sheathing nails, and 2 boxes of roofing nails. Bulk ordering at these quantities qualifies for contractor pricing discounts of 5-10% off retail.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Contractors and DIY builders can optimize nail usage and ensure code compliance by following fastener best practices. Proper nail selection impacts structural performance, material budgets, and inspection outcomes.',
      subsections: [
        { heading: 'Match Nail Length to Material Thickness', text: 'Nail penetration should be at least 1.5 inches into the receiving member for structural connections. A 2x4 framed wall sheathed with 7/16-inch OSB requires 8d nails (2.5 inches) to achieve proper embedment. Using nails that are too short compromises lateral load resistance, particularly in shear walls.' },
        { heading: 'Use Collated Nails for Production Framing', text: 'Pneumatic nail guns using collated strip nails increase installation speed by 300% compared to hand nailing. A framing crew can drive 5,000 nails per day with a nail gun versus 1,500 by hand. The calculator accounts for collated nail losses differently, typically adding only 2% waste versus 5% for hand-driven nails.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about nail quantities, types, and the nail calculator features.',
      subsections: [
        { heading: 'How do I choose between smooth shank and ring shank nails?', text: 'Ring shank nails provide superior pull-out resistance and are required for shear walls and roof decking in high-wind areas. Smooth shank nails are acceptable for standard framing where withdrawal loads are minimal. The calculator prompts for application type to select the appropriate nail style automatically.' },
        { heading: 'What is the waste factor for nail estimation?', text: 'Typical waste factors range from 2% for pneumatic nailing to 5% for hand nailing. Waste includes dropped nails, bent fasteners, and overdriven nails that must be removed. The calculator applies a default 3% waste factor that can be adjusted based on crew experience and job site conditions.' },
      ],
    },
  ],

  'auto-foundation-cost': [
    {
      title: 'What Is Foundation Cost Estimating and Why Does It Matter?',
      content: 'Foundation cost estimation calculates the total expense of constructing a building\'s foundation system, including excavation, concrete, reinforcement, formwork, and labor. Accurate foundation budgeting is critical because foundation costs typically represent 10-15% of total construction costs and errors can lead to structural issues or budget overruns. An automated cost calculator streamlines this process by applying regional cost data and current material prices.',
      subsections: [
        { heading: 'Foundation Types and Cost Drivers', text: 'Foundation costs vary dramatically by type: slab-on-grade ($5-$8 per square foot), crawlspace ($7-$14 per square foot), and full basement ($15-$30 per square foot). Key cost drivers include soil conditions, frost depth, reinforcement requirements, and accessibility. A 1,500-square-foot slab foundation might cost $9,000-$12,000, while a full basement for the same footprint could exceed $45,000.' },
        { heading: 'Regional Cost Variations', text: 'Foundation costs differ by region due to labor rates, material availability, and code requirements. Northern climates require deeper footings below frost line, adding excavation and concrete costs. The calculator adjusts for geographic factors using localized cost indices to produce regionally accurate estimates.' },
      ],
    },
    {
      title: 'How the Auto Foundation Cost Calculator Works',
      content: 'The automated foundation cost calculator processes building dimensions, foundation type, soil data, and regional factors to generate a comprehensive cost estimate. It uses current material pricing, labor productivity rates, and equipment cost data to produce accurate line-item budgets. Users input basic project parameters and receive detailed cost breakdowns.',
      subsections: [
        { heading: 'Cost Components Breakdown', text: 'The calculator itemizes costs into concrete ($120-$150 per cubic yard), rebar ($0.60-$1.20 per linear foot), formwork ($2-$4 per square foot of contact area), excavation ($3-$8 per cubic yard), and labor ($50-$100 per hour for crew). These components are summed and adjusted for local market conditions to produce the total estimate.' },
        { heading: 'Concrete Volume Calculation', text: 'Concrete volume is computed from footing dimensions, wall thickness, and slab depth. A 100-foot perimeter footing that is 12 inches wide and 24 inches deep requires 7.4 cubic yards of concrete: (100 x 1 x 2) / 27 = 7.4 cubic yards. Adding the slab at 4 inches thick for 1,500 square feet adds 18.5 cubic yards.' },
        { heading: 'Reinforcement Quantity Takeoff', text: 'Rebar quantities are calculated based on minimum code requirements of 0.5% of cross-sectional area for footings and 0.18% for slabs. A continuous footing measuring 100 linear feet typically requires four #4 bars running the full length, totaling 400 linear feet of rebar, plus dowels at 48 inches on center.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 1,800-square-foot custom home with a full basement foundation in the Midwest demonstrates the calculator\'s value for early-stage project budgeting and financing.',
      subsections: [
        { heading: 'Project Scenario', text: 'The home requires a 60x30-foot basement with 9-foot walls, a 4-inch slab, and perimeter footings 24 inches deep. Soil conditions require #4 rebar at 12 inches on center both directions in the slab. Frost depth is 42 inches, requiring footings at least 48 inches below grade.' },
        { heading: 'Results and Interpretation', text: 'The calculator estimates foundation costs at $48,500: $12,800 for excavation and backfill, $18,200 for concrete (52 cubic yards total), $5,600 for rebar (3,200 linear feet), $4,900 for formwork, and $7,000 for labor. Waterproofing and drainage add another $4,500, bringing the total to $53,000.' },
        { heading: 'Cost and Material Planning', text: 'The detailed breakdown helps the homeowner decide between a full basement ($53,000) and a crawlspace foundation ($18,000), a difference of $35,000. The calculator also shows that upgrading from standard to ICF forms adds $8,000 but reduces heating costs by 20% annually, providing a 10-year payback analysis.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Foundation contractors and builders use automated cost tools to create accurate bids and avoid expensive change orders. Understanding cost drivers and estimation pitfalls leads to more profitable projects.',
      subsections: [
        { heading: 'Include Soil Testing Costs', text: 'Geotechnical soil tests costing $1,000-$3,000 are essential before finalizing foundation costs. Unexpected soil conditions can add $5,000-$15,000 through deeper footings, soil stabilization, or drainage systems. The calculator can factor soil type into the estimate if test results are available.' },
        { heading: 'Account for Utility Penetrations', text: 'Plumbing, electrical, and HVAC penetrations through foundation walls add labor and material costs. Each penetration requires sleeves, sealing, and inspection. A typical basement requires 8-12 penetrations at $150-$300 each, adding $1,200-$3,600 to the foundation budget that is often overlooked.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about foundation cost estimation and using the auto foundation cost calculator.',
      subsections: [
        { heading: 'How accurate are automated foundation cost estimates?', text: 'Automated estimates are typically within 10-15% of actual contractor bids when accurate inputs are provided. The calculator updates material prices weekly and uses regional labor rate data to maintain accuracy. For preliminary budgeting, this level of precision is sufficient for loan applications and contractor comparisons.' },
        { heading: 'What foundation type is most cost-effective?', text: 'Slab-on-grade foundations are the most cost-effective at $5-$8 per square foot, suitable for warm climates with stable soils. However, in cold climates requiring deep frost protection, the cost advantage narrows. The calculator compares multiple foundation types side by side to help users make informed decisions based on their specific project parameters.' },
      ],
    },
  ],

  'auto-roofing-cost': [
    {
      title: 'What Is Roofing Cost Estimating and Why Does It Matter?',
      content: 'Roofing cost estimation calculates the total expense of installing or replacing a roof system, including materials, labor, underlayment, flashing, and disposal. Roofing is one of the most significant home improvement expenses, with a typical replacement costing $7,000-$15,000 for asphalt shingles and $20,000-$50,000 for premium materials. Automated cost calculators provide homeowners and contractors with instant, accurate budgets for planning and comparison shopping.',
      subsections: [
        { heading: 'Roofing Material Options and Price Ranges', text: 'Asphalt shingles range from $90-$120 per square (100 square feet), metal roofing from $350-$800 per square, tile from $400-$1,200 per square, and slate from $800-$2,000 per square. Each material has different lifespan, warranty, and installation complexity. The calculator helps users compare total installed costs across material options for their specific roof geometry.' },
        { heading: 'Factors That Affect Roofing Costs', text: 'Roof pitch, complexity (valleys, dormers, skylights), number of stories, existing tear-off requirements, and local labor rates all influence final costs. A steep 12/12 pitch roof costs 30-50% more to install than a low-slope roof due to safety equipment requirements and slower installation speeds. The calculator adjusts for these factors automatically.' },
      ],
    },
    {
      title: 'How the Auto Roofing Cost Calculator Works',
      content: 'The automated roofing cost calculator uses roof dimensions, pitch, material selection, and regional labor rates to generate comprehensive cost estimates. It calculates material quantities including shingles, underlayment, flashing, ridge vents, and accessories, then applies current pricing to produce a total installed cost.',
      subsections: [
        { heading: 'Roof Area Calculation', text: 'The calculator converts building footprint to roof area using the pitch multiplier. A 1,500-square-foot building footprint with a 6/12 pitch has a roof area of approximately 1,677 square feet (1,500 x 1.118). Roof area is expressed in squares, where 1 square equals 100 square feet. This example represents 16.8 squares.' },
        { heading: 'Material Quantity Breakdown', text: 'For 17 squares of asphalt shingles, the calculator estimates: 51 bundles of shingles (3 per square), 17 squares of 30-pound felt underlayment, 170 feet of drip edge, 17 ridge vents, and 6 tubes of roofing cement. Each line item is priced from current supplier data to build an accurate material subtotal.' },
        { heading: 'Labor Cost Estimation', text: 'Labor costs are calculated using regional hourly rates and typical installation productivity. A crew of 3 can install approximately 4-5 squares of asphalt shingles per day. At $75 per hour crew rate, 17 squares requires roughly 4 days of labor at $2,400. The calculator adjusts for roof complexity with a difficulty factor.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 1,800-square-foot ranch home with a 7/12 pitch asphalt shingle roof replacement demonstrates the calculator\'s comprehensive estimating capabilities.',
      subsections: [
        { heading: 'Project Scenario', text: 'The existing roof has two layers of shingles needing tear-off, three valleys, one dormer, and two skylights. The home is two stories in the front and one story in the rear, creating complex roof intersections. The homeowner wants architectural shingles with a 30-year warranty in a dimensional style.' },
        { heading: 'Results and Interpretation', text: 'The calculator totals the project at $12,400: $4,200 for materials (22 squares at $190 per square), $3,800 for tear-off and disposal, $3,200 for labor, $600 for new flashing, and $600 for skylight flashing kits. The estimate includes a 10% contingency for unforeseen decking repairs, a common issue during tear-offs.' },
        { heading: 'Cost and Material Planning', text: 'Comparing material options, the calculator shows architectural shingles at $12,400 versus metal standing seam at $22,500. Over a 50-year period, the metal roof requires one installation versus two shingle replacements, making the lifetime cost of metal ($22,500) competitive with two shingle jobs ($24,800). This long-term analysis helps homeowners make value-based decisions.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Roofing contractors and homeowners can maximize value and avoid common pitfalls with automated cost estimation and proper planning.',
      subsections: [
        { heading: 'Always Budget for Decking Replacement', text: 'Roof decking replacement costs $2-$4 per square foot and is needed on 15-25% of re-roof jobs. Budgeting for 20% decking replacement upfront prevents surprise change orders. On an 1,800-square-foot roof, that means setting aside $700-$1,400 for potential plywood replacement.' },
        { heading: 'Get Multiple Quotes Using the Same Specifications', text: 'The calculator provides a standardized material specification that can be shared with multiple contractors. Comparing quotes for identical materials and scope ensures apples-to-apples comparisons. Homeowners who share detailed specs receive 10-15% lower average bids because contractors save estimating time and reduce their risk premium.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about roofing costs and using the auto roofing cost calculator.',
      subsections: [
        { heading: 'How long does a typical roof replacement take?', text: 'A standard 20-30 square roof replacement with asphalt shingles takes 2-5 days for a professional crew of 3-4 workers. Weather delays, complex roof designs, and decking repairs can extend the timeline. The calculator provides duration estimates based on roof size and complexity to help with scheduling.' },
        { heading: 'Is it cheaper to re-roof over existing shingles?', text: 'Tear-off and disposal typically adds $1,000-$2,500 to a roofing project, but installing over existing shingles is generally not recommended. Building codes in most areas limit roofs to two layers due to structural load limits. The calculator compares both options and includes the cost savings of a tear-off when needed for warranty compliance.' },
      ],
    },
  ],

  'auto-flooring-cost': [
    {
      title: 'What Is Flooring Cost Estimating and Why Does It Matter?',
      content: 'Flooring cost estimation calculates the total expense of purchasing and installing flooring materials for residential or commercial spaces. Flooring is one of the largest interior finish expenses, ranging from $2-$15 per square foot for materials and $1-$8 per square foot for installation depending on product type. An automated flooring cost calculator helps homeowners, designers, and contractors compare material options and budget accurately.',
      subsections: [
        { heading: 'Flooring Material Types and Price Tiers', text: 'Laminate flooring ranges from $2-$5 per square foot, luxury vinyl plank from $3-$7 per square foot, engineered hardwood from $5-$10 per square foot, solid hardwood from $6-$15 per square foot, and tile from $3-$12 per square foot. Carpet remains the most budget-friendly at $1-$4 per square foot installed. Each material offers different durability, moisture resistance, and lifespan.' },
        { heading: 'Installation Cost Factors', text: 'Installation costs vary by material complexity, subfloor condition, room shape, and geographic region. Floating floor systems cost $1-$3 per square foot to install, glue-down systems $2-$5 per square foot, and nail-down hardwood $3-$6 per square foot. Removing existing flooring adds $0.50-$2 per square foot and subfloor preparation can add $1-$3 per square foot.' },
      ],
    },
    {
      title: 'How the Auto Flooring Cost Calculator Works',
      content: 'The automated flooring cost calculator uses room dimensions, material selection, and installation preferences to generate detailed cost estimates. It computes material quantities including waste factor, underlayment, transitions, and trim, then applies current pricing and labor rates to produce a comprehensive project budget.',
      subsections: [
        { heading: 'Area Measurement and Waste Factor', text: 'Room area is calculated as length times width. For a 20x15-foot room, the area is 300 square feet. The calculator applies a waste factor of 5-10% for standard layouts and 10-15% for diagonal, herringbone, or rooms with many corners. At 10% waste, the material order quantity becomes 330 square feet.' },
        { heading: 'Underlayment and Accessory Costs', text: 'Underlayment is required for many flooring types to provide moisture protection, sound dampening, and surface leveling. Costs range from $0.15-$1.50 per square foot. Transitions, reducers, T-molding, and quarter-round trim add $1-$3 per linear foot around room perimeters. For a 300-square-foot room with 70 linear feet of perimeter, trim adds $70-$210.' },
        { heading: 'Labor Rate Application', text: 'Labor rates are based on regional averages and installation complexity. Basic vinyl plank installation might cost $2 per square foot, while intricate tile patterns with custom cuts can reach $8 per square foot. The calculator uses a difficulty multiplier for room shapes, with each inside corner or doorway adding to the complexity factor.' },
      ],
    },
    {
      title: 'Real-World Application Example',
      content: 'A 2,400-square-foot home needing flooring throughout demonstrates how the calculator helps homeowners make material and budget decisions across multiple rooms.',
      subsections: [
        { heading: 'Project Scenario', text: 'The home includes 800 square feet of living room and hallways, 400 square feet of kitchen, 300 square feet of dining room, 500 square feet of bedrooms, and 400 square feet of bathrooms. The homeowner wants hardwood in living areas, LVP in the kitchen, tile in bathrooms, and carpet in bedrooms.' },
        { heading: 'Results and Interpretation', text: 'The calculator totals the project at $14,500: hardwood at $7,200 (800 sq ft at $9 installed), LVP at $2,600 (400 sq ft at $6.50 installed), bathroom tile at $3,200 (400 sq ft at $8 installed), and carpet at $1,500 (500 sq ft at $3 installed). Including transitions, underlayment, and trim adds $800 to the total.' },
        { heading: 'Cost and Material Planning', text: 'The calculator shows that upgrading the kitchen from LVP to tile adds $600 but may increase resale value. The detailed estimate helps the homeowner prioritize spending, showing that the most cost-effective upgrade is widening the hardwood plank from 3.25 inches to 5 inches, adding only $400 but significantly enhancing the visual appeal.' },
      ],
    },
    {
      title: 'Professional Tips and Best Practices',
      content: 'Flooring contractors and homeowners can achieve better results and avoid costly mistakes by following industry best practices for material selection and installation planning.',
      subsections: [
        { heading: 'Order Extra Material for Future Repairs', text: 'Always order one extra box of flooring for future repairs. Discontinued styles and dye lots make matching flooring nearly impossible after 1-2 years. For tile, order 10% extra beyond the installation waste factor to ensure you have matching materials for future repairs or renovations.' },
        { heading: 'Acclimate Flooring Before Installation', text: 'Hardwood, engineered wood, and laminate need 48-72 hours of acclimation in the installation space to reach equilibrium moisture content. Installing flooring that hasn\'t fully acclimated can lead to gapping, buckling, or cupping after installation. The calculator includes an acclimation timeline in the project schedule estimate.' },
      ],
    },
    {
      title: 'Frequently Asked Questions',
      content: 'Common questions about flooring costs and using the auto flooring cost calculator.',
      subsections: [
        { heading: 'What is the most durable flooring option?', text: 'Porcelain tile and luxury vinyl plank offer the best durability for high-traffic areas, with lifespans of 20-50 years. Solid hardwood can be refinished multiple times, extending its life to 50+ years. Carpet typically lasts 5-15 years. The calculator provides lifespan and lifecycle cost comparisons for each material option.' },
        { heading: 'How do I measure irregularly shaped rooms?', text: 'Break irregular rooms into rectangles, measure each section, and sum the areas. Add 15-20% waste for complex shapes with angles, alcoves, and multiple entry points. The calculator includes a multi-section room tool that handles L-shaped, T-shaped, and partitioned spaces without manual calculations.' },
      ],
    },
  ],
}

export default articles