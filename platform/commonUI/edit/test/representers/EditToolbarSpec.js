/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2018, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

define(
    ['../../src/representers/EditToolbar'],
    function (EditToolbar) {

        describe("An Edit mode toolbar", function () {
            var mockOpenMCT,
                mockScope,
                testStructure,
                testAB,
                testABC,
                testABC2,
                testABCXYZ,
                testABCYZ,
                testM,
                toolbar;

            function getVisibility(obj) {
                return !obj.hidden;
            }

            beforeEach(function () {
                mockOpenMCT = jasmine.createSpy('openmct', ['objects']);
                mockObjects = jasmine.createSpyObj('objects', ['observe']);
                mockObjects.observe.andReturn();
                mockOpenMCT.objects = mockObjects;
                mockScope = jasmine.createSpyObj("$scope", [
                    "$watchCollection",
                    "$on"
                ]);
                mockScope.$watchCollection.andReturn();
                mockDomainObject = jasmine.createSpyObj("domainObject", [
                    'identifier'
                ]);

                testStructure = [
                        { name: "A", property: "a", domainObject: mockDomainObject },
                        { name: "B", property: "b", domainObject: mockDomainObject },
                        { name: "C", property: "c", domainObject: mockDomainObject },
                        { name: "X", property: "x", domainObject: mockDomainObject },
                        { name: "Y", property: "y", domainObject: mockDomainObject },
                        { name: "Z", property: "z", domainObject: mockDomainObject },
                        { name: "M", method: "m", domainObject: mockDomainObject }
                ];

                testAB = { a: 0, b: 1 };
                testABC = { a: 0, b: 1, c: 2 };
                testABC2 = { a: 4, b: 1, c: 2 }; // For inconsistent-state checking
                testABCXYZ = { a: 0, b: 1, c: 2, x: 'X!', y: 'Y!', z: 'Z!' };
                testABCYZ = { a: 0, b: 1, c: 2, y: 'Y!', z: 'Z!' };
                testM = { m: jasmine.createSpy("method") };

                toolbar = new EditToolbar(mockScope, mockOpenMCT, testStructure);
            });

            it("adds click for controls that define a method", function () {
                var structure = toolbar.getStructure();
                expect(structure[6].click).toBeDefined();
            });

            it("adds key for controls that define a property", function () {
                var structure = toolbar.getStructure();
                expect(structure[0].key).toEqual(0);
            });

            xit("reads properties from getters", function () {
                var structure, state;

                testABC.a = function () {
                    return "from a getter!";
                };

                toolbar.updateToolbar([testABC]);
                structure = toolbar.getStructure();
                state = toolbar.getState();

                expect(state[structure.items[0].key])
                    .toEqual("from a getter!");
            });

            xit("sets properties on update", function () {
                toolbar.updateToolbar([testABC]);
                toolbar.updateState(
                    toolbar.getStructure().items[0].key,
                    "new value"
                );
                // Should have updated the underlying object
                expect(testABC.a).toEqual("new value");
            });

            xit("invokes setters on update", function () {
                var structure;

                testABC.a = jasmine.createSpy('a');

                toolbar.updateToolbar([testABC]);
                structure = toolbar.getStructure();

                toolbar.updateState(
                    structure.items[0].key,
                    "new value"
                );
                // Should have updated the underlying object
                expect(testABC.a).toHaveBeenCalledWith("new value");
            });

            xit("provides a return value describing update status", function () {
                // Should return true if actually updated, otherwise false
                var key;
                toolbar.updateToolbar([testABC]);
                key = toolbar.getStructure().items[0].key;
                expect(toolbar.updateState(key, testABC.a)).toBeFalsy();
                expect(toolbar.updateState(key, "new value")).toBeTruthy();
            });

            xit("adds click functions when a method is specified", function () {
                toolbar.setSelection([testM]);
                // Verify precondition
                expect(testM.m).not.toHaveBeenCalled();
                // Click!
                toolbar.getStructure().items[5].click();
                // Should have called the underlying function
                expect(testM.m).toHaveBeenCalled();
            });
        });
    }
);


