const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('[Seed] Notice: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Skipping admin creation.');
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash: passwordHash
      }
    });
    console.log(`[Seed] Admin user created: ${adminEmail}`);
  } else {
    console.log(`[Seed] Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Members
  const existingMembersCount = await prisma.member.count();
  if (existingMembersCount === 0) {
    const initialMembers = [
      {
        name: 'GIRIDHARI PADHY',
        role: 'LEAD CINEMATOGRAPHER & CORDINATOR',
        department: "CSE '23",
        quote: '"Frame every moment like it\'s the opening shot of an indie festival winner."',
        bio: 'Directs flagship cinematic films, anamorphic lens rigs, visual language architecture, and overall collective production operations at NIST University.',
        photoUrl: 'member/member-1.png',
        instagramHandle: '@hiddenbharatwithbiki',
        sortOrder: 1
      },
      {
        name: 'ROHIT CHOUDHURY',
        role: 'HEAD OF CINEMATOGRAPHY',
        department: "MECH '26",
        quote: '"Natural light is an excuse for those who haven\'t mastered shape and shadow."',
        bio: 'Supervises camera packages, multi-cam gaffer schemes, crane/gimbal operations, and live-event technical cinematography.',
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn21MNrTQLc88EQNLnVxDIFvCgv8wBROgC8PZ9Te4YlwYVbEAGCxRmwtJVyUwKesfram7vtwGPQdPZn7ZjV5cFHwwSA39GxNSSGohwM5avDC1O1rWrVCnftDYLAtBVIjmBUURSedEiwpBMXcZBzX531TxiTDePXAf4HGk1bNMAVSoM_pnhuV4XRxpGZsveo9Hl7e9ge33oFGnpAfuC2oQWRbdAM_iMK_NLe2M7sxresNg3K6iNnmHmsQ',
        instagramHandle: '@rohit.cin',
        sortOrder: 2
      },
      {
        name: 'SNEHA MOHAPATRA',
        role: 'EDITOR-IN-CHIEF',
        department: "ECE '25",
        quote: '"If the paragraph doesn\'t accelerate the pulse, cut it without hesitation."',
        bio: 'Curates campus print monographs, investigative documentary narratives, script revisions, and voice-over sequencing.',
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX4MBdfoAtVc0t3seBvJuliFcrWTOgfdsQM_womvFuqoa64gumHSm3MKNfYTHRXJv30-KqcHEXeO1HXi337sQ14e73DWWcMHKMnfD9r1rLdW33d4j_U7w6PkseaTNK49P4S6q6vMpMF87BUaVlNfiA_obvNF5D2YiNi8eHaTVF1-3_PlJGKDYcIA31-c8kzU6BsiQgojCjyBs-erpR4ZyXR__E3NoxY1tULV06_DW4jZSIzjBEs_67JQ',
        instagramHandle: '@sneha.words',
        sortOrder: 3
      },
      {
        name: 'DEVASHISH PANDA',
        role: 'LEAD SOUND & COLORIST',
        department: "IT '26",
        quote: '"People tolerate imperfect visuals. They flee from mediocre audio."',
        bio: 'Master color grading in DaVinci Resolve, spatial sound engineering, Dolby Atmos location audio capture, and master foley synchronization.',
        photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrYPpxC-Y_y_qtwxpwpEKAryEfeH-6CeM0GgKaehKBi2WvF5gmxQkkuZQuMGpWyI8XanEWXi0KbP7KqRFrq2IIhCSzKFEFDJfakb5xP_AA29Fn7HTNtsPdSPjOcFy4JSLMzGo9coOGyVsPscaTveFs8nt8ok61C2BtqWe0uDdbZ45QHBN9ENEj_opJcmGi9Ra3M6CM7l2freC5nIUhTrgTnLySU1TtD0lwylXOMjLYutbAX5WZUs8-iw',
        instagramHandle: '@dev.foley',
        sortOrder: 4
      }
    ];

    for (const m of initialMembers) {
      await prisma.member.create({ data: m });
    }
    console.log(`[Seed] Seeded ${initialMembers.length} collective members.`);
  }

  // 3. Seed Work Items
  const existingWorkCount = await prisma.workItem.count();
  if (existingWorkCount === 0) {
    const initialWork = [
      {
        title: 'A DISTANT BELL // CONVOCATION 2024',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9sY8Wf71Tfx64zWq6s55J8Y3nK0gL6w9cK8wP9c6u3kZ0yO7wX-m3vK6eK5zU6vX8m4k8c9p1vX9wO-7e3k6nQ9zU6vX8m4k8c9p1vX9wO-7e3k6nQ9zU6vX8m4k8c9p1vX9wO-7e3k6nQ9zU',
        category: 'DOCUMENTARY // 4K // 22 MIN',
        videoUrl: 'team/Video-3002.mp4',
        description: 'An intimate chronicle of graduating seniors walking through the misty corridors of NIST one final time. Captured on vintage prime anamorphic lenses.',
        sortOrder: 1
      },
      {
        title: 'COURTYARD ECHOES // ACOUSTIC NIGHT',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBje00nEw_y965Kb9PCTIK64oxEcg9hRsog7pbvMJp73vWxlqxurPlrWdP2se0uz5SnW2F_T4M4CSQ6EjRrRXQay44d-i_ok-zO4V2MD54S6u9ZT7EUG04_mdZlkQQEnnAzXOxgdctp2uVDfcJ6vVCoG3ws43UIbA9fxWJzlDVmdZpWd2LgTTXFLn1P1ivO5bXnFSdcsnlENG1VEXrhmNTLthgY33TXowM-ishSZpEEW_FzuhA81LtqvA',
        category: 'LIVE PERFORMANCE // DOLBY ATMOS',
        videoUrl: 'team/Video-3002.mp4',
        description: 'Multi-track live audio capture and four-camera synchronized cut of the annual unplugged concert under the amphitheater lights.',
        sortOrder: 2
      },
      {
        title: 'SILICON HORIZONS // LAB INVENTIONS',
        thumbnailUrl: 'team/Screenshot 2026-09-20 200951.png',
        category: 'CAMPUS SPOTLIGHT // MACRO CINEMA',
        videoUrl: 'team/Video-3002.mp4',
        description: 'High-speed macro cinematography revealing the delicate soldering, quantum sensors, and microcontrollers built by student engineers.',
        sortOrder: 3
      }
    ];

    for (const w of initialWork) {
      await prisma.workItem.create({ data: w });
    }
    console.log(`[Seed] Seeded ${initialWork.length} work archive items.`);
  }

  // 4. Seed Wire Photos
  const existingWireCount = await prisma.wirePhoto.count();
  if (existingWireCount === 0) {
    const initialWirePhotos = [
      {
        reelTag: '[ REEL #104 ]',
        title: 'TESTING ANAMORPHIC FLARES ON QUAD FOUNTAINS',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5mBJS8gm7NXtOCyyB-hjG7pHtKFbFtyBK_fWwTp0k1cJTp0G6SCWbKo5vZ0r23o5PkWF1huRBZfIfYb340nl4IhzLITIXGaVUFgd0oI9PA-SMdbYOEPG8yHw6W9PspSHP8DHNZTynFwHDudR0PrhwpI-0fzg1Tu_Hg_dyvO0QtzTSWjRVEi6rF_hZnCRh4wBSXo035f6pMjusA7muRQji66ZF-5E3ev5HY0qZBQX__oqg53a9mvJ5ZA',
        description: 'Optical tests capturing 2.39:1 horizontal anamorphic streak flare patterns across the illuminated university quad fountains at midnight.',
        sortOrder: 1
      },
      {
        reelTag: '[ REEL #105 ]',
        title: 'GOLDEN HOUR GOLDEN JUBILEE SESSIONS',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrSckkD0-KZm8TxAFkMA7lP_YRTuQr3TVkAsAyw_N89S-F9haafhdDDGQthXaeCcG6I2si3_KXjYTy39bXdmNFjKT2afR9sgB0pE5-cGOkjxlY--9R8PO-otrGd43m6zHE7E6euUIOth8HyfbC7YstlZ7tuokNqaW4N4qkgNsvrgPRHXTn6Pl-n0ADDJ4robuJJ3i_71Hh_JJQBkNIRD3nlOhmHe5nt7Zp_3ONXBjbvfcRSkbqGzZNUw',
        description: 'Cinematographers shooting handheld golden hour sequences on NIST campus cobblestones using prime cinema glass.',
        sortOrder: 2
      },
      {
        reelTag: '[ REEL #106 ]',
        title: 'RE-RECORDING CONVOCATION VOICEOVER STEMS',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBje00nEw_y965Kb9PCTIK64oxEcg9hRsog7pbvMJp73vWxlqxurPlrWdP2se0uz5SnW2F_T4M4CSQ6EjRrRXQay44d-i_ok-zO4V2MD54S6u9ZT7EUG04_mdZlkQQEnnAzXOxgdctp2uVDfcJ6vVCoG3ws43UIbA9fxWJzlDVmdZpWd2LgTTXFLn1P1ivO5bXnFSdcsnlENG1VEXrhmNTLthgY33TXowM-ishSZpEEW_FzuhA81LtqvA',
        description: 'Foley studio faders and dynamic audio mastering for spatial multi-channel commencement broadcast.',
        sortOrder: 3
      },
      {
        reelTag: '[ REEL #107 ]',
        title: "WRAP ON SHORT FILM 'LATENCY 2025'",
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQsndK_lerGGNqmVdITV1WJTi8279ctRzXeR6eEalSO3ftbNzmj1qVNiAUIQzsJACYR3DYS26bOQw_WcBFXL5hQTwYmpF0Ep1SE0R9KzN4nk773ybOO9XlnITPjhGd4654BRu8GDbNcOq0Sv27kYe1p2tM9jQZUNy7Y4ezCWwtjQ1OYebLkRV0fdUOdecDiTxXvllMemdam3thsqyV_CNJNGAw8jFbSeFuCWiYfHCq4XByvK_ZYeZtWw',
        description: 'Final slate mark and principal photography wrap on the student-written sci-fi thriller Latency.',
        sortOrder: 4
      }
    ];

    for (const p of initialWirePhotos) {
      await prisma.wirePhoto.create({ data: p });
    }
    console.log(`[Seed] Seeded ${initialWirePhotos.length} wire photo reels.`);
  }

  // 5. Seed Sample Application
  const existingAppCount = await prisma.application.count();
  if (existingAppCount === 0) {
    await prisma.application.create({
      data: {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@nist.edu',
        department: 'ECE 2nd Year',
        portfolioLink: 'https://vimeo.com/aaravfilms',
        message: 'Passionate about documentary cinematography and color grading in DaVinci Resolve. Would love to operate secondary cameras on university shoots.',
        status: 'new'
      }
    });
    console.log('[Seed] Seeded sample crew application.');
  }

  console.log('--- Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
