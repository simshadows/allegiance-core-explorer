/*
 * extractedConstants.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 * Copyright (C) 2008 FAZ Dev Team. All Rights Reserved.
 * 
 * All values from here were extracted from Allegiance IGC Core editor
 * <https://github.com/kgersen/allegice> by KGJV <kirthalleg@gmail.com>,
 * which itself was extracted from the Allegiance codebase.
 */

const c_cbFileNameDB    = 12;
const c_cbDescriptionDB = 200;
const c_cbNameDB        = 24;
const c_cbLocAbrevDB    = 8;
const c_cbFileName      = c_cbFileNameDB    + 1;
const c_cbDescription   = c_cbDescriptionDB + 1;
const c_cbName          = c_cbNameDB        + 1;
const c_cbLocAbrev      = c_cbLocAbrevDB    + 1;
const c_cbCDKey         = 32 + 1;
const c_cbPassportName  = 256 + 1;

const c_fcidMax  = 40;
const c_dmgidMax = 20;
const c_defidMax = 20;

/*** ***/

export default {
    //c_cbFileNameDB,
    //c_cbDescriptionDB,
    //c_cbNameDB,
    //c_cbLocAbrevDB,
    c_cbFileName,
    //c_cbDescription,
    c_cbName,
    //c_cbLocAbrev,
    //c_cbCDKey,
    //c_cbPassportName,

    c_fcidMax,
    c_dmgidMax,
    c_defidMax,

    // ObjectType
    //OT_invalid          : -1,

    //OT_modelBegin       :  0,
    //OT_ship             :  0,
    //OT_station          :  1,
    //OT_missile          :  2,
    //OT_mine             :  3,
    //OT_probe            :  4,
    //OT_asteroid         :  5,

    //OT_projectile       :  6,
    //OT_warp             :  7,
    //OT_treasure         :  8,
    //OT_buoy             :  9,
    //OT_chaff            : 10,
    //OT_buildingEffect   : 11,
    //OT_modelEnd         : 11,

    //OT_side             : 12,
    //OT_cluster          : 13,
    //OT_bucket           : 14,

    //OT_partBegin        : 15,
    //OT_weapon           : 15,
    //OT_shield           : 16,
    //OT_cloak            : 17,
    //OT_pack             : 18,
    //OT_afterburner      : 19,
    //OT_launcherBegin    : 20,
    //OT_magazine         : 20,
    //OT_dispenser        : 21,
    //OT_launcherEnd      : 21,
    //OT_partEnd          : 21,


    //OT_staticBegin      : 22,
    //OT_projectileType   : 22,
    //OT_missileType      : 23,
    //OT_mineType         : 24,
    //OT_probeType        : 25,
    //OT_chaffType        : 26,
    OT_civilization     : 27,
    //OT_treasureSet      : 28,

    //OT_bucketStart      : 29,
    //OT_hullType         : 29,
    //OT_partType         : 30,
    //OT_stationType      : 31,
    //OT_development      : 32,
    //OT_droneType        : 33,
    //OT_bucketEnd        : 33,
    //OT_staticEnd        : 33,

    OT_constants        : 34,
    //OT_allsrvUser       : 35,
    //OT_Max              : 36
};

