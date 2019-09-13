import React, { useRef, useState } from "react";
import Animated, {
  Transition,
  Transitioning,
  TransitioningView
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

import { useMemoOne } from "use-memo-one";
import Content from "./Content";
import ScrollView from "./ScrollView";
import Search, { THRESHOLD } from "./Search";
import SearchBox from "./SearchBox";

const { Value, useCode, cond, greaterOrEq, call } = Animated;
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const transition = (
  <Transition.Together>
    <Transition.In type="scale" durationMs={400} />
    <Transition.Out type="scale" durationMs={400} />
  </Transition.Together>
);

export default () => {
  const ref = useRef<TransitioningView>(null);
  const [search, setSearch] = useState(false);
  const y = useMemoOne(() => new Value(0), []);
  const showSearchBox = () => {
    if (!search && ref.current) {
      ref.current.animateNextTransition();
      setSearch(true);
    }
  };
  useCode(cond(greaterOrEq(y, THRESHOLD), call([], showSearchBox)), []);
  return (
    <Transitioning.View style={styles.container} {...{ transition, ref }}>
      <Search {...{ y }} />
      <ScrollView {...{ y }}>
        <Content />
      </ScrollView>
      <SearchBox visible={search} onRequestClose={() => setSearch(false)} />
    </Transitioning.View>
  );
};