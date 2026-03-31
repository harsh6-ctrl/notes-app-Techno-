require("dotenv").config();
const mongoose = require("mongoose");
const Subject = require("./models/Subject");

const subjects = [
    { year: 1, name: "Engineering Mathematics-I", pdf: "https://drive.google.com/file/d/13Jk-VGRCOmDGb3EfirWibj00dMPmuoQA/view?usp=sharing", yt: "https://youtu.be/McOc6OUC7Pc?si=gMdB7jmgbBDYQwrs", suggestion: "Search Topicwise with name of Gajendra purohit sir" },
    { year: 1, name: "Engineering Chemistry", pdf: "https://drive.google.com/file/d/19Bz15PvEQsX2_FTfjvEyvHNBIbwFeJJ5/view?usp=sharing", yt: "https://youtu.be/Rb7s2yisUUE?si=s2lXmHgErkCN81QP", suggestion: "Learn Chemistry from 'Science by Avani' on YouTube" },
    { year: 1, name: "Basic Mechanical Engineering", pdf: "links/BME.pdf", yt: "https://youtu.be/2ndTIUnS6qs?si=RsaIJQM8Kx7xeiUt", suggestion: "Refer to 'Basic Mechanical Engineering' by R.K. Rajput for detailed explanations." },
    { year: 1, name: "Engineering Mathematics-II", pdf: "https://drive.google.com/file/d/1JUBJuGdBUfgJA-F4dUYi1aJdLM--jfg9/view?usp=sharing", yt: "https://youtu.be/McOc6OUC7Pc?si=gMdB7jmgbBDYQwrs", suggestion: "Search Topicwise with name of Gajendra purohit sir" },
    { year: 1, name: "Engineering Physics", pdf: "https://drive.google.com/file/d/18B0Ihz60j4urZ2YPJY-KFnqeXI2251LB/view?usp=sharing", yt: "https://youtu.be/zwEOlsdsgJw?si=WV22-J7wosH93Pef", suggestion: "Learn Physics from 'Science by Avani' on YouTube" },
    { year: 1, name: "Basic Electrical Eng.", pdf: "https://drive.google.com/file/d/1sf_1j_vtUsEV_lzcqVGh7Fe6EmIdZGt1/view?usp=sharing", yt: "https://youtu.be/rttcOFKPphQ?si=IXrbwnr-nTfTeMQn", suggestion: "Learn Basic Electrical Engineering from Perfect Computer Engineer" },

    { year: 2, name: "Data Structures & Algorithms", 
        pdf: "https://drive.google.com/file/d/1oWCBzUM9s4pxmlX2CehFGbLYQnHaWY4-/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&si=rTyaXtSGODGwt2GE", 
         suggestion: "Learn Algorithms from Abdul bari for end sem and striver for placement." },

    { year: 2, name: "Object Oriented Programming",
         pdf: "https://drive.google.com/file/d/1D5W69XWgDxjDx25ABbbokscTxqflgkUI/view?usp=sharing",
          yt: "https://youtube.com/playlist?list=PLmRclvVt5DtlXMvqL0zDqQu9Cvy6rsmd4", 
          suggestion: "Learn OOPs from 'Code It Up' on YouTube." },

    { year: 2, name: "Digital Electronics", 
        pdf: "https://drive.google.com/file/d/1UH-wwgZkrqt75KIz26zElSa5iBLY12Pj/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PL5H7yfUmc71mCfqVcmsoWYYU4-7Uc0nUy", 
         suggestion: "Learn Digital Electronics from 'Knowledge Campus' on YouTube." },

    { year: 2, name: "MEFA", pdf: "links/dsa.pdf",
         yt: "https://youtube.com/playlist?list=PLim9gWjsjN-PB8hoZal2xwD2OCICjB8Lx",
          suggestion: "Refer to 'MEFA' from notes and PYQS." },

    { year: 2, name: "Software Engineering",
         pdf: "links/se.pdf",
          yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2", 
          suggestion: "Learn from notes and PYQS." },

    { year: 2, name: "Advance Mathematics Engineering", 
        pdf: "https://drive.google.com/file/d/1VuQypn3FUE2lDyplIzi4E3bmxSZG-RgO/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLhuDMO4Nt-wsBoby4XFyjII8OuijeDeaU",
          suggestion: "Search Topicwise with name of Gajendra purohit sir" },

{ year: 2, name: "Discrete Mathematics", 
        pdf: "https://drive.google.com/file/d/1pVsBXpx9Lip3AkysI5DcDk-OkXdWZWZ-/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLhuDMO4Nt-wsBoby4XFyjII8OuijeDeaU",
          suggestion: "Search Topicwise with name of Gajendra purohit sir" },


    { year: 2, name: "Database Management System",
         pdf: "https://drive.google.com/file/d/1hiOGmnO5c9DH0F6wyCoQ8g2SCgGs-GqV/view?usp=sharing",
          yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", 
          suggestion: "Learn DBMS from 'Gate Smashers' on YouTube." },

    { year: 2, name: "Microprocessor Interface", 
        pdf: "https://drive.google.com/file/d/1AOHd63RjK7z0BPDaVhJUTjWYqugphr8H/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLfzBO7vcQZ1IMDUDXph5wB9csF-yYD4GC", 
         suggestion: "Learn Microprocessor Interface from 'Bharat Acharya' on YouTube." },

    { year: 2, name: "Theory Of Computation",
         pdf: "https://drive.google.com/file/d/1gwSVXrz_Aa8V5_TqpVTY-AJU-nfWX1Nf/view?usp=sharing", 
         yt: "https://youtube.com/playlist?list=PL1QH9gyQXfgsUBfYUR0WirJASgif4pHVX",
          suggestion: "Learn TOC from 'The GateHub' on YouTube." },

    { year: 2, name: "Data Communication and Computer Networks",
         pdf: "https://drive.google.com/file/d/1Y9k8jtUYK4I3zIV9w80bZbHXmJKXfUSu/view?usp=sharing ",
          yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_", 
          suggestion: "Learn from 'Gate Smasher' on YouTube." },

    { year: 2, name: "Principles Of Communication",
         pdf: "https://drive.google.com/file/d/1w22Uqnm5GTSrbY-bOHPAu0bkPk3ms6t-/view?usp=sharing",
          yt: "https://youtube.com/playlist?list=PL0s3O6GgLL5falRKBVe0tSRgp6Hud9oKm",
           suggestion: "Learn from class notes of teacher." },


    { year: 3, name: "Operating Systems",
         pdf: "https://drive.google.com/file/d/1SZqkaoxfTpxAC9pPWePIc1EL2e-5IgZH/view?usp=sharing",
          yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", 
          suggestion: "Learn from 'Gate Smashers' on YouTube." },

    { year: 3, name: "Compiler Design", 
        pdf: "https://drive.google.com/file/d/1yCUlhjTmL1fCPCRbI9qvH8TpLrdCyNP0/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PL1QH9gyQXfguPNDTsnG90W2kBDQpYLDQr",
          suggestion: "Learn from 'The GateHub' on YouTube." },

    { year: 3, name: "Computer Graphics & Multimedia",
         pdf: "https://drive.google.com/file/d/1-dyyw1ATuXU5dN4Mam6feM-jUI1paRKC/view?usp=sharing",
          yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiH2neELedJ9eXc8iR49oNVV",
           suggestion: "Learn from 'Gate Smashers' on YouTube." },

    { year: 3, name: "Analysis of Algorithms", 
        pdf: "https://drive.google.com/file/d/1zQExdgL_RGOr0V17HsAxmciJ91amJC4K/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa", 
         suggestion: "Learn from 'Gate Smashers' on YouTube." },

    { year: 3, name: "Software Testing and Project Management",
         pdf: "https://drive.google.com/file/d/1Wj8fhQV5duMLK4u9fvheDJVH4iQ1_5LK/view?usp=sharing", 
         yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2", 
         suggestion: "Learn from 'Gate Smashers' on YouTube." },

    { year: 3, name: "Digital Image Processing", 
        pdf: "https://drive.google.com/file/d/19ji04JPMtu2JyneqM0yiaUq9NTrFDhg4/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLbwfaPBgAKFEPBg-OFzmjFWmRKKrYigLi",
          suggestion: "Learn from 'College Friendly' on YouTube." },

    { year: 3, name: "Machine Learning",
        pdf: "https://drive.google.com/file/d/14K3p57PWNDpvbcFp_oMWI-x53bYNMR7R/view?usp=sharing",
         yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiEXg5BV10k9THtjnS48yI-T", 
         suggestion: "Learn from 'Gate Smashers' on YouTube." },

    { year: 3, name: "Information Security System",
         pdf: "We provide notes for this subject very soon", 
         yt: "https://youtube.com/playlist?list=PLYwpaL_SFmcArHtWmbs_vXX6soTK3WEJw", 
         suggestion: "Learn from '5 Minutes Engineering' on YouTube." },

    { year: 3, name: "Computer Architecture and Organization", 
        pdf: "https://drive.google.com/file/d/1G1tABbIHBXTTfh5osinRhrlaqCyl2BTn/view?usp=sharing", 
        yt: "unable to find any good playlist for this subject",
         suggestion: "Learn from class notes and assignments." },

    { year: 3, name: "Artificial Intelligence",
         pdf: "https://drive.google.com/file/d/19NNSbY9SoS4zdg8G-oF4MUyngxTgIBwZ/view?usp=sharing", 
         yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI", 
         suggestion: "Learn from 'Gate Smashers' on YouTube." },

    { year: 3, name: "Distributed System",
         pdf: "https://drive.google.com/file/d/1L4FUpkwCOVq9I9Iq05GkiuEBEL52TaWj/view?usp=sharing",
          yt: "https://youtube.com/playlist?list=PLPIwNooIb9vhYroMrNpoBYiBUFzTwEZot", 
          suggestion: "Learn from class notes and PYQS." },

    { year: 3, name: "Cloud Computing",
         pdf: "https://drive.google.com/file/d/1v7FJapyW2DjYGToEkgNP4_qGGQuzFOqT/view?usp=sharing", 
         yt: "https://youtube.com/playlist?list=PLxCzCOWd7aiHRHVUtR-O52MsrdUSrzuy4",
          suggestion: "Learn from 'Gate Smashers' on YouTube." },


    { year: 4, name: "Artificial Intelligence",
         pdf: "links/ai.pdf", 
         yt: "" },

    { year: 4, name: "Cloud Computing", pdf: "links/cloud.pdf", yt: "" }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");
        await Subject.deleteMany({});       // clears old data first
        await Subject.insertMany(subjects);
        console.log("✅ Subjects seeded successfully!");
        process.exit();
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });